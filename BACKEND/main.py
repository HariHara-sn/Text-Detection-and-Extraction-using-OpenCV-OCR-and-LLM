from fastapi import FastAPI
from src.routes.prescription import router as prescription_router
from src.middlewares.cors import setup_cors
from src.config import Config
import uvicorn

Config.validate()

app = FastAPI(title="Prescription OCR & Chatbot API")

# Middlewares
setup_cors(app)

# Routes
app.include_router(prescription_router)

@app.get("/")
async def root():
    print("started hari")
    return {"message": "Prescription OCR & Chatbot API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
