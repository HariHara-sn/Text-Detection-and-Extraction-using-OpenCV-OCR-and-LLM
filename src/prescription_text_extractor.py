import os
from PIL import Image
import google.generativeai as genai
from src.config import Config
from prompts.prescription_prompt import PRESCRIPTION_EXTRACTOR_PROMPT

import logging

logger = logging.getLogger("PrescriptionExtractor")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)


class PrescriptionExtractor:
    def __init__(self):
        if not Config.API_KEY:
            logger.error("Google API Key not found")
            raise ValueError("Missing API_KEY")
        genai.configure(api_key=Config.API_KEY)
        self.model = genai.GenerativeModel(Config.GEMINI_MODEL_NAME)

    def load_image(self, path=None):
        path = path or Config.IMAGE_PATH
        if not os.path.exists(path):
            logger.error(f"File not found: {path}")
            raise FileNotFoundError(path)
        logger.info(f"Loading image: {path}")
        return Image.open(path)

    def extract(self, image):
        logger.info("Sending prompt to Gemini...")
        response = self.model.generate_content(
            [PRESCRIPTION_EXTRACTOR_PROMPT, image],
            generation_config={"temperature": 0.0, "max_output_tokens": 512}
        )
        logger.info("Extraction complete")
        return response.text.strip()