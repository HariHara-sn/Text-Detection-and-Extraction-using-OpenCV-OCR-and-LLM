import json
import google.generativeai as genai
from src.config import Config
from prompts.chatbot_system_prompt import CHATBOT_SYSTEM_PROMPT
import logging

logger = logging.getLogger("PrescriptionChatbot")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)


class PrescriptionChatbot:
    def __init__(self, extracted_json: dict):
        if not Config.API_KEY:
            logger.error("Google API Key not found")
            raise ValueError("Missing API_KEY")

        genai.configure(api_key=Config.API_KEY)
        self.model = genai.GenerativeModel(Config.GEMINI_MODEL_NAME)
        self.prescription_json = extracted_json

    def chat(self, user_query: str) -> str:
        logger.info("Generating chatbot response")

        prompt = f"""
            {CHATBOT_SYSTEM_PROMPT}

            Prescription JSON:
            {json.dumps(self.prescription_json, indent=2)}

            User Question:
            {user_query}
        """

        response = self.model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.2,
                "max_output_tokens": 300
            }
        )

        return response.text.strip()
