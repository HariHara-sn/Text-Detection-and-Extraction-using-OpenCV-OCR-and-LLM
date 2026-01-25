OpenCV-OCR-TextExtraction/
│
├── PrescriptionImg/                    
│   └── MedicalPrescription.png
│
├── prompts/
│   └── prescription_prompt.py          
│
├── src/
│   ├── __init__.py
│   ├── config.py                       # Centralizes all settings in one place
│   ├── prescription_text_extractor.py                    
│   └── main.py                         # entry point
│
├── requirements.txt                     
└── README.md

[Layered Architecture or Modular Architecture]

config.py → configuration layer

prompts/ → constants / template layer

prescription_text_extractor.py → core logic / “model” layer

main.py → orchestration layer / runner