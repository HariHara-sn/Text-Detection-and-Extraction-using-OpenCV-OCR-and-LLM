from src.prescription_text_extractor import PrescriptionExtractor

def main():
    extractor = PrescriptionExtractor()
    image = extractor.load_image()
    extracted_text = extractor.extract(image)
    
    print("\n🔍 Extracted Text")
    print("=" * 40)
    print(extracted_text)
    print("=" * 40)

if __name__ == "__main__":
    main()
