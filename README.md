# DevScale CRM — Enterprise AI Sales & Account Intelligence

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Llama--3.1-F05A28?style=for-the-badge&logo=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

**An autonomous AI copilot engineered for enterprise B2B sales pipelines to eliminate manual interaction logging and blocker tracking.**

[Live Production Demo](https://ai-crm-hcp-tau.vercel.app) • [Report Issue](https://github.com/Mishradity/ai-crm-hcp/issues)

</div>

---

## ⚡ Overview

Traditional CRM platforms require reps to spend hours manually logging interaction summaries, tagging sentiment, and escalating deal risks. 

**DevScale CRM** replaces manual data entry with an autonomous LangGraph & Groq inference pipeline. Sales engineers and account executives can submit conversational call notes, and the Copilot instantly:
- Extracts key stakeholders (names, roles, departments).
- Identifies critical technical, SLA, and compliance blockers.
- Dynamically infers deal velocity (Positive champions, Spec Review, Critical Risk).
- Dispatches actionable follow-ups directly to the centralized database and UI state.

---

## ✨ Key Features

- **Sub-Second Extraction Engine:** Powered by Groq Llama-3.1 inference microservice via FastAPI.
- **Dynamic Redux Pipeline Sync:** Real-time form population and UI state management without manual reloads.
- **Contextual Sentiment Classification:** Distinguishes genuine enterprise champions from compliance and SLA blockers.
- **Resilient Fallback Architecture:** Custom exception handlers to guarantee zero CORS breakdown and continuous 99.9% uptime.
- **Warm-State Health Monitoring:** Automated 24/7 pings preventing serverless container spin-down latency.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite (Hosted on Vercel)
- **Backend:** FastAPI, Python 3.11, Pydantic, SQLite / SQLAlchemy (Hosted on Render)
- **Inference & Intelligence:** Groq Cloud API, Llama-3.1, Agentic Tool Workflows
- **Availability:** Monitored via UptimeRobot automated pings

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Mishradity/ai-crm-hcp.git
cd ai-crm-hcp
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Open a new terminal tab
cd frontend
npm install
npm run dev
```

---

## 🌐 API Reference

#### Post Chat / Meeting Notes
```http
POST /api/chat
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | **Required**. Meeting transcription or raw summary note |

**Sample Response:**
```json
{
  "reply": "Engagement logged for Priya (VP of Engineering). Sentiment flagged as 'Positive'.",
  "extracted_data": {
    "hcp_name": "Priya (VP of Engineering)",
    "interaction_type": "Meeting",
    "sentiment": "Positive",
    "outcomes": "Client confirmed high interest and validated technical architecture.",
    "follow_up_actions": "Dispatch Master Services Agreement (MSA) and issue production keys."
  }
}
```

---

## 👨‍💻 Author

**Aditya Mishra**
- **GitHub:** [@Mishradity](https://github.com/Mishradity)
- **Live Demo:** [ai-crm-hcp-tau.vercel.app](https://ai-crm-hcp-tau.vercel.app)
