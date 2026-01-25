# ============================================================
# Prescription Text Extraction using Gemini 2.5 Flash
# ============================================================

import os
import sys
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv


load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("ERROR: GOOGLE_API_KEY not found in environment variables.")
    sys.exit(1)

genai.configure(api_key=API_KEY)


model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-lite"
)

# ------------------------------------------------------------
# 3. Validate Input
# ------------------------------------------------------------
image_path = "PrescriptionImg/MedicalPrescription.png"  

if not os.path.exists(image_path):
    print(f"ERROR: File not found -> {image_path}")
    exit(1)

image = Image.open(image_path)
print("Image loaded successfully!")

# ------------------------------------------------------------
# 4. Strict Text Extraction Prompt
# ------------------------------------------------------------
PROMPT = """
You are an expert medical assistant. Analyze this prescription and extract the following information in JSON format.
        Focus strictly on the medicine details and instructions.
        
        {
            "date": "Date of prescription",
            "medicines": [
                {
                    "name": "Exact name of the tablet/medicine",
                    "quantity": "How much to take (e.g., 1 tablet, 5ml)",
                    "timing": {
                        "morning": "Yes/No",
                        "afternoon": "Yes/No",
                        "night": "Yes/No",
                        "instruction": "Before meal / After meal / Empty stomach / etc."
                    },
                    "frequency": "Raw frequency string (e.g., 1-0-1)",
                    "duration": "For how many days the medicine should be taken"
                }
            ],
            "notes": "Any special instructions"
        }
        If a field is missing, use "-". Return ONLY the JSON.
"""

# ------------------------------------------------------------
# Gemini Call - passing PROMPT and IMAGE
# ------------------------------------------------------------
response = model.generate_content(
    [PROMPT, image],
    generation_config={
        "temperature": 0.0,
        "max_output_tokens": 512
    }
)

print("\n Extracted Text")
print("=" * 40)
print(response.text.strip())
print("=" * 40)

