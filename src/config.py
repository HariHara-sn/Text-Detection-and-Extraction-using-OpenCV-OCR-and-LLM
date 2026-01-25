import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    API_KEY = os.getenv("GOOGLE_API_KEY")
    GEMINI_MODEL_NAME = "gemini-2.5-flash-lite"
    # IMAGE_PATH = "PrescriptionImg/MedicalPrescription.png"
    IMAGE_PATH = "PrescriptionImg/Data/C1zfaD6WgAAanXM.jpg"

    @staticmethod
    def validate():
        if not Config.API_KEY:
            print("Warning: API_KEY is missing. Ensure you have access.")
