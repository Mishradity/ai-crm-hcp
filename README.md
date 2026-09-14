# AI-First CRM HCP Module – Log Interaction Screen

An AI-first Customer Relationship Management (CRM) system designed for life sciences sales representatives to log interactions with Healthcare Professionals (HCPs) via a dual interface: structured form and conversational AI assistant.

## Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS, Google Font Inter[cite: 1]
- **Backend**: Python FastAPI, SQLAlchemy, SQLite/PostgreSQL[cite: 1]
- **AI Agent Framework**: LangGraph[cite: 1]
- **LLM**: Groq API (gemma2-9b-it / llama-3.1-8b-instant)[cite: 1]

---

## 5 Specific LangGraph Sales Tools

1. **`log_interaction`** (Mandatory): Captures conversational text, uses LLM for entity extraction & sentiment analysis, and logs interaction into CRM database[cite: 1].
2. **`edit_interaction`** (Mandatory): Enables updating previously logged HCP interactions by record ID[cite: 1].
3. **`search_hcp_history`**: Queries past meeting records, sentiment patterns, and interaction details of a specific doctor.
4. **`suggest_follow_ups`**: Analyzes discussion topics to generate smart follow-up suggestions (e.g., sharing clinical trials, advisory boards).
5. **`check_sample_inventory`**: Real-time stock lookups for drug samples (e.g., OncoBoost) and promotional clinical materials.

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
-------------------------------
## Add grok API key

  GROQ_API_KEY=your_groq_api_key
  DATABASE_URL=sqlite:///./crm.db



uvicorn app.main:app --reload --port 8000




cd frontend
npm install
npm run dev

