import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FileUploadZone from "@/components/FileUploadZone";
import MedicineTable from "@/components/MedicineTable";
import FloatingChatbot from "@/components/FloatingChatbot";
import { performClientOCR, cancelOCR, uploadPrescriptionToBackend } from "@/lib/ocr-service";
import type { UploadedFile, OCRProgress, Prescription } from "@/types/prescription";

const UploadPrescription = () => {
  const navigate = useNavigate();
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileAccepted = useCallback((file: UploadedFile) => {
    setPreviewUrl(file.preview);
    setUploadedFile(file);
    setPrescription(null);
    setOcrProgress(null);
  }, []);

  const handleRemovePreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedFile(null);
    setPrescription(null);
    setOcrProgress(null);
    cancelOCR();
  }, [previewUrl]);


  const handleUploadClick = useCallback(async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Use real backend instead of dummy data
      const result = await uploadPrescriptionToBackend(uploadedFile.file, setOcrProgress);
      setPrescription(result);
    } catch (error) {
      console.error("Prescription processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedFile]);

  const handleSelectMedicine = useCallback((name: string) => {
    setSelectedMedicine(prev => prev === name ? null : name);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Upload Prescription</h1>
              <p className="text-sm text-muted-foreground">
                Upload an image to extract medicine details
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section - Show when no preview */}
        {!previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <FileUploadZone
              onFileAccepted={handleFileAccepted}
              ocrProgress={null}
              onCancel={() => {}}
            />
          </motion.div>
        )}

        {/* Preview Section - Show after file selected but before processing */}
        <AnimatePresence>
          {previewUrl && !prescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-card rounded-xl p-6 shadow-card-elevated">
                {/* Preview Image with X button */}
                <div className="relative mb-4">
                  <button
                    onClick={handleRemovePreview}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={previewUrl} 
                      alt="Prescription preview" 
                      className="w-full max-h-[400px] object-contain"
                    />
                  </div>
                </div>

                {/* OCR Progress */}
                {ocrProgress && isProcessing && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{ocrProgress.message}</span>
                      <span className="text-primary font-medium">{ocrProgress.progress}%</span>
                    </div>
                    <Progress value={ocrProgress.progress} className="h-2" />
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  className="w-full gap-2"
                  onClick={handleUploadClick}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload & Extract
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {prescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center">
              Extracted Medicine Details
            </h2>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Original Prescription */}
              <div className="bg-card rounded-xl p-6 shadow-card-elevated">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Original Prescription
                </h3>
                
                {previewUrl && (
                  <div className="rounded-lg overflow-hidden bg-muted mb-4">
                    <img 
                      src={previewUrl} 
                      alt="Uploaded prescription" 
                      className="w-full max-h-[350px] object-contain"
                    />
                  </div>
                )}
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{prescription.date}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="text-foreground mt-1">{prescription.notes}</p>
                  </div>
                </div>
              </div>

              {/* Right: Medicine Table */}
              <MedicineTable
                medicines={prescription.medicines}
                selectedMedicine={selectedMedicine}
                onSelectMedicine={handleSelectMedicine}
              />
            </div>

            {/* Upload Another Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleRemovePreview}
              >
                Upload Another Prescription
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Chatbot */}
      {prescription && (
        <FloatingChatbot
          prescription={prescription}
          selectedMedicine={selectedMedicine}
        />
      )}
    </div>
  );
};

export default UploadPrescription;
