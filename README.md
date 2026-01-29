# 🏥 Medical Prescription Extraction System

## Overview

This project builds a **medical prescription understanding system**, starting with a robust **perception layer** and progressively evolving into a **safe, explainable, and interactive chatbot**.

The system is developed incrementally across clearly versioned milestones:

* **Version 1.0.0** – [Simple text extraction](https://github.com/HariHara-sn/Text-Detection-and-Extraction-using-OpenCV-OCR-and-LLM/tree/Sample-Extraction)
* **Version 2.0.0** – [Medical prescription extraction](https://github.com/HariHara-sn/Text-Detection-and-Extraction-using-OpenCV-OCR-and-LLM/tree/medical-prescription-extraction)
* **Version 3.0.0** – [Medical prescription chatbot](https://github.com/HariHara-sn/Text-Detection-and-Extraction-using-OpenCV-OCR-and-LLM/tree/medical-prescription-chatbot)
* **Version 4.0.0** – [Production-ready full-stack system](https://github.com/HariHara-sn/Text-Detection-and-Extraction-using-OpenCV-OCR-and-LLM/tree/medical-prescription-production)

  * Fully functional frontend and backend

---

## 🛠️ Tech Stack

### Backend

* **Framework:** FastAPI (Python)
* **AI Model:** Google Gemini 2.5 Flash (Multimodal LLM)
* **Server:** Uvicorn (ASGI)
* **Validation:** Pydantic
* **Image Processing:** Pillow (PIL)
* **Architecture:** Modular MVC-style structure (Config, Controllers, Models, Routes, Utils)

### Frontend

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS

---

## 🎯 Problem Statement

Doctor prescriptions are often:

* Handwritten
* Highly ambiguous
* Filled with abbreviations and shorthand
* Difficult or impossible for patients to read

Traditional OCR systems struggle significantly with this kind of data.

---

## ▶️ How to Run

### 1️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Set the API Key

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_api_key
```

### 3️⃣ Run the Server

```bash
python -m uvicorn main:app --reload
```

---

## 📤 Example Output

```json
{
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500 mg",
      "frequency": "3 times a day",
      "duration": "7 days",
      "form": "capsule"
    },
    {
      "name": "Ibuprofen",
      "dosage": "200 mg",
      "frequency": "as needed for pain",
      "duration": "5 days",
      "form": "tablet"
    }
  ],
  "notes": "Take Amoxicillin with food to avoid stomach upset."
}
```

Sample outputs and proof-of-concept images can be found in the **POC-IMAGES** folder.

> **Note:** No medical interpretation or decision-making is applied at this stage.

---

## 🧪 Why Not “Just Google Lens”?

This project does **not** aim to compete with OCR tools.

Instead, it focuses on:

* Handling **medical ambiguity**
* Making **assumptions explicit**
* Enabling **safe downstream reasoning**
* Supporting integration into **clinical or pharmacy workflows**

Text extraction is only the **first building block** of a larger intelligent system.

---

## ⚠️ Disclaimer

This project is intended for **educational and research purposes only**.

It is **not a substitute** for professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 👤 Author

**Hari Hara Sudhan S**
*B.Tech – Information Technology*
