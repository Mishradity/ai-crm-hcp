from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    interaction_type = Column(String(100), default="Meeting")
    date = Column(String(50))
    time = Column(String(50))
    attendees = Column(String(255), nullable=True)
    topics_discussed = Column(Text, nullable=True)
    materials_shared = Column(JSON, default=list)
    samples_distributed = Column(JSON, default=list)
    sentiment = Column(String(50), default="Neutral")
    outcomes = Column(Text, nullable=True)
    follow_up_actions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class HCPProfile(Base):
    __tablename__ = "hcp_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    specialty = Column(String(255))
    hospital = Column(String(255))
    email = Column(String(255))

class SampleInventory(Base):
    __tablename__ = "sample_inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(255), unique=True)
    stock_count = Column(Integer, default=0)
    category = Column(String(100))