from pydantic import BaseModel
from typing import List, Optional

class InteractionBase(BaseModel):
    hcp_name: str
    interaction_type: Optional[str] = "Meeting"
    date: Optional[str] = ""
    time: Optional[str] = ""
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    materials_shared: Optional[List[str]] = []
    samples_distributed: Optional[List[str]] = []
    sentiment: Optional[str] = "Neutral"
    outcomes: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

class InteractionCreate(InteractionBase):
    pass

class ChatRequest(BaseModel):
    message: str
    current_form_data: Optional[dict] = None