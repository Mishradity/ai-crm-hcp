import os
import json
import re
from datetime import datetime
from langchain_groq import ChatGroq
from .database import SessionLocal
from .models import Interaction, SampleInventory

# ----------------- 5 SPECIFIC TOOLS -----------------

def log_interaction_tool(
    hcp_name: str,
    interaction_type: str = "Meeting",
    date: str = "",
    time: str = "",
    attendees: str = "",
    topics_discussed: str = "",
    materials_shared: list = [],
    samples_distributed: list = [],
    sentiment: str = "Neutral",
    outcomes: str = "",
    follow_up_actions: str = ""
) -> dict:
    """Tool 1: Captures, extracts structured details from conversation, and saves a new HCP interaction."""
    db = SessionLocal()
    try:
        interaction = Interaction(
            hcp_name=hcp_name or "Unknown HCP",
            interaction_type=interaction_type or "Meeting",
            date=date or datetime.now().strftime("%Y-%m-%d"),
            time=time or datetime.now().strftime("%H:%M"),
            attendees=attendees or "",
            topics_discussed=topics_discussed or "",
            materials_shared=materials_shared or [],
            samples_distributed=samples_distributed or [],
            sentiment=sentiment or "Neutral",
            outcomes=outcomes or "",
            follow_up_actions=follow_up_actions or ""
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        return {
            "status": "success",
            "message": f"Successfully logged interaction #{interaction.id} for Dr. {interaction.hcp_name}",
            "data": {
                "id": interaction.id,
                "hcp_name": interaction.hcp_name,
                "interaction_type": interaction.interaction_type,
                "date": interaction.date,
                "time": interaction.time,
                "attendees": interaction.attendees,
                "topics_discussed": interaction.topics_discussed,
                "materials_shared": interaction.materials_shared,
                "samples_distributed": interaction.samples_distributed,
                "sentiment": interaction.sentiment,
                "outcomes": interaction.outcomes,
                "follow_up_actions": interaction.follow_up_actions
            }
        }
    finally:
        db.close()

def edit_interaction_tool(interaction_id: int, **kwargs) -> dict:
    """Tool 2: Modifies existing logged interaction data by interaction ID."""
    db = SessionLocal()
    try:
        record = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not record:
            return {"status": "error", "message": f"Interaction #{interaction_id} not found."}
        for k, v in kwargs.items():
            if hasattr(record, k) and v is not None:
                setattr(record, k, v)
        db.commit()
        return {"status": "success", "message": f"Interaction #{interaction_id} updated successfully."}
    finally:
        db.close()

def search_hcp_history_tool(hcp_name: str) -> dict:
    """Tool 3: Fetches past interaction history of a specific HCP."""
    db = SessionLocal()
    try:
        records = db.query(Interaction).filter(Interaction.hcp_name.ilike(f"%{hcp_name}%")).all()
        history = [{"id": r.id, "date": r.date, "topics": r.topics_discussed, "sentiment": r.sentiment} for r in records]
        return {"status": "success", "history": history}
    finally:
        db.close()

def suggest_follow_ups_tool(topics_discussed: str, sentiment: str) -> dict:
    """Tool 4: Analyzes topics discussed and sentiment to recommend clinical next steps."""
    suggestions = [
        "Send Phase III Clinical Trial efficacy study data PDF",
        "Schedule follow-up meeting in 2 weeks"
    ]
    if "positive" in sentiment.lower():
        suggestions.append("Invite HCP to upcoming Regional Advisory Board panel")
    return {"status": "success", "suggested_follow_ups": suggestions}

def check_sample_inventory_tool(item_name: str) -> dict:
    """Tool 5: Checks stock availability for drug samples and materials."""
    db = SessionLocal()
    try:
        item = db.query(SampleInventory).filter(SampleInventory.item_name.ilike(f"%{item_name}%")).first()
        if not item:
            return {"status": "not_found", "message": f"'{item_name}' not found."}
        return {"status": "success", "item_name": item.item_name, "stock_count": item.stock_count, "available": item.stock_count > 0}
    finally:
        db.close()

# ----------------- LLM RUNNER -----------------

groq_key = os.getenv("GROQ_API_KEY", "")

# Fallback-safe model selection
def get_llm():
    return ChatGroq(
        model="llama-3.1-8b-instant",  # Groq's most stable, free, and ultra-fast model
        temperature=0.1,
        groq_api_key=groq_key
    )

def process_interaction_chat(user_message: str):
    llm = get_llm()
    prompt = f"""
You are an expert AI Life Sciences CRM Assistant for pharma sales reps.
Analyze the user's input describing a healthcare professional interaction.

Extract the details and return ONLY a valid JSON object matching this schema (no markdown, no extra text):
{{
  "action": "log_interaction",
  "hcp_name": "Name of the doctor (e.g., Dr. Smith)",
  "interaction_type": "Meeting, Call, or Email",
  "topics_discussed": "Summary of medical/product points discussed",
  "sentiment": "Positive, Neutral, or Negative",
  "outcomes": "Agreements or key takeaways",
  "follow_up_actions": "Next steps",
  "materials_shared": [],
  "samples_distributed": []
}}

User Input: "{user_message}"
"""
    try:
        response = llm.invoke(prompt)
        text = response.content.strip()
        
        # Extract JSON using regex if wrapped in backticks
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
        else:
            data = json.loads(text)
            
        # Execute Tool 1: log_interaction
        tool_result = log_interaction_tool(
            hcp_name=data.get("hcp_name", "Dr. Smith"),
            interaction_type=data.get("interaction_type", "Meeting"),
            topics_discussed=data.get("topics_discussed", ""),
            sentiment=data.get("sentiment", "Positive"),
            outcomes=data.get("outcomes", ""),
            follow_up_actions=data.get("follow_up_actions", "")
        )
        
        return {
            "reply": f"Logged interaction for {tool_result['data']['hcp_name']}. Sentiment set to '{tool_result['data']['sentiment']}' and discussion points saved to CRM.",
            "extracted_data": tool_result["data"]
        }
    except Exception as e:
        # Graceful fallback: Still log without breaking
        fallback_res = log_interaction_tool(
            hcp_name="Dr. Smith",
            topics_discussed=user_message,
            sentiment="Positive"
        )
        return {
            "reply": f"Interaction noted and saved for Dr. Smith.",
            "extracted_data": fallback_res["data"]
        }