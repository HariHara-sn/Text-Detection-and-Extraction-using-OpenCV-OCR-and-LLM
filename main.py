import json
import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io

from src.prescription_text_extractor import PrescriptionExtractor
from src.prescription_chatbot import PrescriptionChatbot
from src.utils import extract_json_from_llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

extractor = PrescriptionExtractor()

class ChatRequest(BaseModel):
    query: str
    history: List[Dict[str, Any]] = []
    prescription_data: Dict[str, Any]

@app.post("/upload")
async def upload_prescription(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        
        extracted_text = extractor.extract(image)
        
        try:
            prescription_json = extract_json_from_llm(extracted_text)
            return prescription_json
        except ValueError as e:
            print("first",e)
            raise HTTPException(status_code=500, detail=f"JSON Parsing Error: {str(e)}")
            
    except Exception as e:
        print("middle",e)
        raise HTTPException(status_code=500, detail=f"Processing Error: {str(e)}")

@app.post("/chat")
async def chat_with_prescription(request: ChatRequest):
    try:
        chatbot = PrescriptionChatbot(request.prescription_data)
        response_text, updated_history = chatbot.chat(request.query, request.history)
        
        
        return {
            "response": response_text,
            "history": request.history + [
                {"role": "user", "parts": [request.query]},
                {"role": "model", "parts": [response_text]}
            ]
        }
    except Exception as e:
        print("last",e)
        raise HTTPException(status_code=500, detail=f"Chat Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
