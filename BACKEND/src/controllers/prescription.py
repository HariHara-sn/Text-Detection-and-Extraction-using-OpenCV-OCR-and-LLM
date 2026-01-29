import os
import json
import logging
from PIL import Image
import google.generativeai as genai
from src.config import Config
from prompts.prescription_prompt import PRESCRIPTION_EXTRACTOR_PROMPT
from prompts.chatbot_system_prompt import CHATBOT_SYSTEM_PROMPT

logger = logging.getLogger("PrescriptionController")
logger.setLevel(logging.DEBUG)

class PrescriptionExtractor:
    def __init__(self):
        if not Config.API_KEY:
            raise ValueError("Missing API_KEY")
        genai.configure(api_key=Config.API_KEY)
        self.model = genai.GenerativeModel(Config.GEMINI_MODEL_NAME)

    def extract(self, image: Image.Image):
        logger.info("Sending prompt to Gemini...")
        response = self.model.generate_content(
            [PRESCRIPTION_EXTRACTOR_PROMPT, image],
            generation_config={"temperature": 0.0, "max_output_tokens": 512}
        )
        logger.info("Extraction complete")
        return response.text.strip()

class PrescriptionChatbot:
    def __init__(self, extracted_json: dict):
        if not Config.API_KEY:
            raise ValueError("Missing API_KEY")

        genai.configure(api_key=Config.API_KEY)
        self.model = genai.GenerativeModel(
            model_name=Config.GEMINI_MODEL_NAME,
            system_instruction=CHATBOT_SYSTEM_PROMPT
        )
        self.prescription_json = extracted_json

    def chat(self, user_query: str, history=None) -> tuple[str, list]:
        logger.info("Generating chatbot response")
        history = history or []
        chat = self.model.start_chat(history=history)
        
        context_query = user_query
        if not history:
            context_query = f"Here is the prescription data in JSON format: {json.dumps(self.prescription_json)}. \n\nUser Question: {user_query}"

        response = chat.send_message(
            context_query,
            generation_config={
                "temperature": 0.2,
                "max_output_tokens": 500
            }
        )
        return response.text.strip(), chat.history
