import json
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from .models import Interaction, SampleInventory, HCPProfile
from .schemas import InteractionCreate, ChatRequest
from .agent import process_interaction_chat

# Database tables auto creation
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_seed():
    db = next(get_db())
    if db.query(SampleInventory).count() == 0:
        samples = [
            SampleInventory(item_name="OncoBoost 10mg", stock_count=45, category="sample"),
            SampleInventory(item_name="CardioShield 25mg", stock_count=20, category="sample"),
            SampleInventory(item_name="Phase III Efficacy Brochure", stock_count=100, category="material"),
            SampleInventory(item_name="Safety Monograph 2025", stock_count=50, category="material")
        ]
        db.add_all(samples)
        db.commit()
    if db.query(HCPProfile).count() == 0:
        db.add_all([
            HCPProfile(name="Dr. Smith", specialty="Oncology", hospital="Memorial Cancer Center", email="drsmith@example.com"),
            HCPProfile(name="Dr. Sharma", specialty="Cardiology", hospital="Apex Heart Institute", email="drsharma@example.com")
        ])
        db.commit()

@app.post("/api/interactions")
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    interaction = Interaction(**payload.dict())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

@app.get("/api/interactions")
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(Interaction.id.desc()).all()

@app.post("/api/chat")
def chat_with_agent(payload: ChatRequest):
    result = process_interaction_chat(payload.message)
    return result