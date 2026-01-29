from pydantic import BaseModel
from typing import List, Dict, Any

class ChatRequest(BaseModel):
    query: str
    history: List[Dict[str, Any]] = []
    prescription_data: Dict[str, Any]
