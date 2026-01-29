import re
import json

def extract_json_from_llm(text: str) -> dict:
    """
    Extracts JSON object from LLM output that may contain markdown code blocks.
    """
    # Remove ```json and ``` wrappers
    cleaned = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON after cleaning: {e}")
