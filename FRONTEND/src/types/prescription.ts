/**
 * Core prescription data types following the required JSON schema
 */

export interface MedicineTiming {
  morning: "Yes" | "No";
  afternoon: "Yes" | "No";
  night: "Yes" | "No";
  instruction: string;
}

export interface Medicine {
  name: string;
  quantity: string;
  timing: MedicineTiming;
  frequency: string;
  duration: string;
}

export interface Prescription {
  date: string;
  medicines: Medicine[];
  notes: string;
}

/**
 * OCR processing states and types
 */
export type OCRStatus = "idle" | "loading" | "processing" | "complete" | "error";

export interface OCRProgress {
  status: OCRStatus;
  progress: number; // 0-100
  message: string;
}

export interface OCRResult {
  rawText: string;
  confidence: number;
}

/**
 * Chat message types for the prescription chatbot
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

/**
 * File upload types
 */
export interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "pdf";
}

/**
 * Parser configuration for swapping OCR backends
 */
export interface OCRConfig {
  provider: "tesseract" | "google-vision" | "aws-textract" | "custom";
  apiUrl?: string;
  apiKey?: string;
}

/**
 * Demo/sample prescription data matching the required format
 */
export const DEMO_PRESCRIPTION: Prescription = {
  date: "-",
  medicines: [
    {
      name: "Enzsol Poudy",
      quantity: "2 t/f water",
      timing: {
        morning: "Yes",
        afternoon: "Yes",
        night: "Yes",
        instruction: "-"
      },
      frequency: "1-1-1",
      duration: "-"
    },
    {
      name: "Tab Acu-prosyvan CR 200",
      quantity: "1",
      timing: {
        morning: "Yes",
        afternoon: "No",
        night: "No",
        instruction: "After meal"
      },
      frequency: "1-0-0",
      duration: "-"
    },
    {
      name: "Cap Bever",
      quantity: "1",
      timing: {
        morning: "Yes",
        afternoon: "Yes",
        night: "Yes",
        instruction: "At night"
      },
      frequency: "1-1-1",
      duration: "-"
    },
    {
      name: "Ethical Dj Sachet",
      quantity: "1",
      timing: {
        morning: "Yes",
        afternoon: "No",
        night: "No",
        instruction: "With milk"
      },
      frequency: "1-0-0",
      duration: "5 days"
    }
  ],
  notes: "-"
};
