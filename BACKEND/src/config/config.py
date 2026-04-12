import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL_NAME = "gemini-2.5-flash-lite"
    IMAGE_PATH = "PrescriptionImg/Data/C1zfaD6WgAAanXM.jpg"

    @staticmethod
    def validate():
        if not Config.API_KEY:
            print("Warning: GOOGLE_API_KEY is missing in .env file.")
        else:
            print(f"API Configured with model: {Config.GEMINI_MODEL_NAME}")