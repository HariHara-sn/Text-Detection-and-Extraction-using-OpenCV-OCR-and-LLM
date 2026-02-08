import re
import json
import logging

logger = logging.getLogger("JSONParser")

def extract_json_from_llm(text: str) -> dict:
    """
    Extracts JSON object from LLM output that may contain markdown code blocks or extra text.
    """
    # Try to find the first '{' and last '}'
    start_index = text.find('{')
    end_index = text.rfind('}')

    if start_index == -1 or end_index == -1:
        # Fallback to cleaning if no braces found (though unlikely for valid JSON)
        cleaned = re.sub(r"```json|```", "", text).strip()
    else:
        cleaned = text[start_index:end_index + 1]

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error: {e}. Cleaned text: {cleaned}")
        raise ValueError(f"Invalid JSON after cleaning: {e}")
