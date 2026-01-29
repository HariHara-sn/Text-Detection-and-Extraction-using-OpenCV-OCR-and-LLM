/**
 * OCR Service - Client-side Tesseract.js with fallback for server OCR
 */

import Tesseract, { createWorker } from "tesseract.js";
import type { OCRProgress, OCRResult, OCRConfig, Prescription } from "@/types/prescription";

const BACKEND_URL = "http://localhost:8000";

let worker: Tesseract.Worker | null = null;
let abortController: AbortController | null = null;

/**
 * Initialize Tesseract worker (lazy initialization)
 */
async function getWorker(): Promise<Tesseract.Worker> {
  if (!worker) {
    worker = await createWorker("eng", 1, {
      logger: (m) => {
        console.log("[Tesseract]", m);
      },
    });
  }
  return worker;
}

/**
 * Client-side OCR using Tesseract.js
 */
export async function performClientOCR(
  imageSource: string | File | Blob,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  abortController = new AbortController();
  
  try {
    onProgress?.({
      status: "loading",
      progress: 0,
      message: "Initializing OCR engine..."
    });
    
    const w = await getWorker();
    
    onProgress?.({
      status: "processing",
      progress: 20,
      message: "Processing image..."
    });
    
    // Perform recognition
    const result = await w.recognize(imageSource, {}, {
      text: true,
    });
    
    onProgress?.({
      status: "complete",
      progress: 100,
      message: "Extraction complete!"
    });
    
    return {
      rawText: result.data.text,
      confidence: result.data.confidence
    };
    
  } catch (error) {
    onProgress?.({
      status: "error",
      progress: 0,
      message: error instanceof Error ? error.message : "OCR failed"
    });
    throw error;
  }
}

/**
 * Cancel ongoing OCR operation
 */
export function cancelOCR(): void {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Cleanup worker when done
 */
export async function terminateOCR(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

/**
 * Server-side OCR call (Google Vision / AWS Textract / Custom API)
 * This is a template - replace with your actual API implementation
 */
export async function performServerOCR(
  imageSource: File | Blob,
  config: OCRConfig,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  if (!config.apiUrl) {
    throw new Error("Server OCR requires an API URL");
  }
  
  onProgress?.({
    status: "loading",
    progress: 10,
    message: "Preparing image for upload..."
  });
  
  const formData = new FormData();
  formData.append("image", imageSource);
  
  onProgress?.({
    status: "processing",
    progress: 30,
    message: "Uploading to OCR service..."
  });
  
  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`OCR API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    onProgress?.({
      status: "complete",
      progress: 100,
      message: "Extraction complete!"
    });
    
    // Adapt response format based on provider
    switch (config.provider) {
      case "google-vision":
        return {
          rawText: data.responses?.[0]?.fullTextAnnotation?.text || "",
          confidence: 95 // Google Vision doesn't always return confidence
        };
      case "aws-textract":
        return {
          rawText: data.Blocks?.filter((b: any) => b.BlockType === "LINE")
            .map((b: any) => b.Text)
            .join("\n") || "",
          confidence: data.Blocks?.[0]?.Confidence || 90
        };
      default:
        // Custom API - expect { text: string, confidence: number }
        return {
          rawText: data.text || "",
          confidence: data.confidence || 80
        };
    }
    
  } catch (error) {
    onProgress?.({
      status: "error",
      progress: 0,
      message: error instanceof Error ? error.message : "Server OCR failed"
    });
    throw error;
  }
}

/**
 * Send prescription to FastAPI backend for extraction
 */
export async function uploadPrescriptionToBackend(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<Prescription> {
  onProgress?.({
    status: "processing",
    progress: 30,
    message: "Uploading and processing prescription..."
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
    }

    onProgress?.({
      status: "complete",
      progress: 100,
      message: "Processing complete!"
    });

    return await response.json();
  } catch (error) {
    onProgress?.({
      status: "error",
      progress: 0,
      message: error instanceof Error ? error.message : "Upload failed"
    });
    throw error;
  }
}

/**
 * Send chat query to FastAPI backend
 */
export async function sendChatQuery(
  query: string,
  prescriptionData: Prescription,
  history: any[] = []
): Promise<{ response: string; history: any[] }> {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        prescription_data: prescriptionData,
        history,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Chat failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}
