# 🏥 Medical Prescription Extraction System

## Overview

This project aims to build a **medical prescription understanding system**, starting with a **robust perception layer** and evolving into a **safe, explainable, and interactive chatbot**.

The current version focuses **only** on **accurate text extraction** from handwritten doctor prescriptions using a **multimodal LLM (Gemini 1.5 Flash)**.

---

## 🛠️ Tech Stack

### **Backend**
- **Framework:** FastAPI (Python)
- **AI Model:** Google Gemini 1.5 Flash (Multimodal LLM)
- **Server:** Uvicorn (ASGI)
- **Validation:** Pydantic
- **Image Processing:** Pillow (PIL)
- **Architecture:** Modular MVC-style structure (Config, Controllers, Models, Routes, Utils)

### **Frontend**
- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI & Lucide React

---

## 🎯 Problem Statement

Doctor prescriptions are:

* Handwritten
* Highly ambiguous
* Filled with abbreviations and shorthand
* Often unreadable by patients

Traditional OCR systems fail on this data.
---

## How to Run

### 1️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 2️⃣ Set API Key

Create a `.env` file:

```env
GOOGLE_API_KEY = your_api_key
```

### 3️⃣ Run the Script

```bash
python -m uvicorn main:app --reload
```

---

## 📤 Example Output

```
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

> Output is **plain text only**.
> No medical interpretation is applied at this stage.

---

## 🧪 Why Not “Just Google Lens”?

This project does **not** aim to compete with OCR tools.

The goal is to:

* Handle **medical ambiguity**
* Make **assumptions explicit**
* Enable **safe downstream reasoning**
* Integrate into **clinical workflows**

Text extraction is only the **first building block**.

---

## ⚠️ Disclaimer

This project is for **educational and research purposes only**.
It is **not a substitute** for professional medical advice.

Always consult a qualified healthcare professional.

---

## 🤝 Contributing
Contributions are welcome!
```
1. Fork it
2. Create new branch
3. Commit changes
4. Open Pull Request
```

## 👤 Author

**HARI HARA SUDHAN S** *B.TECH IT*


