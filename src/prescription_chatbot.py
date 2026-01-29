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
        self.model = genai.GenerativeModel(
            model_name=Config.GEMINI_MODEL_NAME,
            system_instruction=CHATBOT_SYSTEM_PROMPT
        )
        self.prescription_json = extracted_json

    def chat(self, user_query: str, history=None) -> tuple[str, list]:
        logger.info("Generating chatbot response")
        
        # Prepare context by including the prescription JSON in the first message if history is empty
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
