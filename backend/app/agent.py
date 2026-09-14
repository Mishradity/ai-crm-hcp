def process_interaction_chat(user_message: str):
    # Rule-based detection taaki fallback me bhi accurate rahe
    msg_lower = user_message.lower()
    
    # 1. Dynamic Sentiment Detection
    if any(w in msg_lower for w in ["negative", "poorly", "failed", "freeze", "blocker", "risk", "unhappy", "dissatisfied"]):
        detected_sentiment = "Negative"
    elif any(w in msg_lower for w in ["neutral", "evaluating", "reviewing", "pending"]):
        detected_sentiment = "Neutral"
    else:
        detected_sentiment = "Positive"

    # 2. Dynamic Stakeholder Extraction
    stakeholder = extract_stakeholder_name(user_message)
    if stakeholder.startswith("with "):
        stakeholder = stakeholder.replace("with ", "").strip()

    # 3. Dynamic Outcomes & Follow-ups based on Sentiment
    if detected_sentiment == "Negative":
        default_outcomes = "Technical / SLA blockers raised. Escalated to solutions architecture team."
        default_follow_up = "Schedule critical remediation call; review latency SLA parameters."
    elif detected_sentiment == "Neutral":
        default_outcomes = "Specifications and security compliance under team review."
        default_follow_up = "Provide technical documentation and follow up next week."
    else:
        default_outcomes = "Agreed to proceed with trial / sandbox validation."
        default_follow_up = "Provision sandbox API credentials and dispatch SLA specs."

    try:
        llm = get_llm()
        prompt = f"""
You are DevScale AI Copilot, an Enterprise B2B SaaS Sales & Technical Engagement Agent.
Analyze the user's meeting notes: "{user_message}"

Extract the details accurately and return ONLY a valid JSON object matching this schema (strictly no markdown formatting, no backticks, just raw JSON):
{{
  "action": "log_interaction",
  "hcp_name": "{stakeholder}",
  "interaction_type": "Meeting",
  "attendees": "Engineering & Architecture Team",
  "topics_discussed": "{user_message}",
  "sentiment": "{detected_sentiment}",
  "outcomes": "{default_outcomes}",
  "follow_up_actions": "{default_follow_up}",
  "materials_shared": [],
  "samples_distributed": []
}}
"""
        response = llm.invoke(prompt)
        text = response.content.strip()
        
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
        else:
            data = json.loads(text)
            
        client_name = data.get("hcp_name", "").strip() or stakeholder
        if client_name.lower().startswith("with "):
            client_name = client_name[5:].strip()

        sentiment_val = data.get("sentiment") or detected_sentiment

        tool_result = log_interaction_tool(
            hcp_name=client_name,
            interaction_type=data.get("interaction_type", "Meeting"),
            attendees=data.get("attendees", "Engineering & Architecture Team"),
            topics_discussed=data.get("topics_discussed", user_message),
            sentiment=sentiment_val,
            outcomes=data.get("outcomes", default_outcomes),
            follow_up_actions=data.get("follow_up_actions", default_follow_up)
        )
        
        return {
            "reply": f"Logged engagement for {tool_result['data']['hcp_name']}. Sentiment flagged as '{tool_result['data']['sentiment']}' and blockers synced to pipeline.",
            "extracted_data": tool_result["data"]
        }

    except Exception as e:
        print(f"Fallback triggered due to error: {e}")
        # Bulletproof Fallback: Uses exact user sentiment instead of hardcoded Positive
        fallback_res = log_interaction_tool(
            hcp_name=stakeholder,
            topics_discussed=user_message,
            sentiment=detected_sentiment,
            outcomes=default_outcomes,
            follow_up_actions=default_follow_up
        )
        return {
            "reply": f"Engagement logged for {stakeholder}. Sentiment flagged as '{detected_sentiment}'.",
            "extracted_data": fallback_res["data"]
        }