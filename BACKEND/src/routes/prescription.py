from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io
from src.controllers.prescription import PrescriptionExtractor, PrescriptionChatbot
from src.models.chat import ChatRequest
from src.utils.json_parser import extract_json_from_llm

router = APIRouter()
extractor = PrescriptionExtractor()

@router.post("/upload")
async def upload_prescription(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        content = await file.read()
        print("1. Image uploaded", flush=True)
        image = Image.open(io.BytesIO(content))
        
        print("2. Processing.....", flush=True)
        extracted_text = extractor.extract(image)
        
        try:
            prescription_json = extract_json_from_llm(extracted_text)
            return prescription_json
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"JSON Parsing Error: {str(e)}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing Error: {str(e)}")

@router.post("/chat")
async def chat_with_prescription(request: ChatRequest):
    try:
        chatbot = PrescriptionChatbot(request.prescription_data)
        response_text, _ = chatbot.chat(request.query, request.history)
        
        return {
            "response": response_text,
            "history": request.history + [
                {"role": "user", "parts": [request.query]},
                {"role": "model", "parts": [response_text]}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat Error: {str(e)}")
