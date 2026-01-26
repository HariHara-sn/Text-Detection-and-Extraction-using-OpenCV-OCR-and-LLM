import json
from src.prescription_text_extractor import PrescriptionExtractor
from src.prescription_chatbot import PrescriptionChatbot
from src.utils import extract_json_from_llm

def main():
    extractor = PrescriptionExtractor()
    image = extractor.load_image()
    extracted_text = extractor.extract(image)

    print("\n🔍 Extracted Text")
    print("=" * 40)
    print(extracted_text)
    print("=" * 40)

    try:
        prescription_json = extract_json_from_llm(extracted_text)
    except ValueError as e:
        print(f"❌ JSON Parsing Error: {e}")
        return


    chatbot = PrescriptionChatbot(prescription_json)

    print("\n💬 Prescription Chatbot Ready")
    print("Type 'exit' to quit\n")

    while True:
        user_query = input("You: ").strip()
        if user_query.lower() == "exit":
            print("Chatbot: Please consult your doctor for confirmation.")
            break

        response = chatbot.chat(user_query)
        print(f"\nChatbot: {response}\n")


if __name__ == "__main__":
    main()
