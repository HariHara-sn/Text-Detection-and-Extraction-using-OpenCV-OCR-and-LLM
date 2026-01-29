import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Camera, 
  FileImage, 
  File, 
  X, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { UploadedFile, OCRProgress } from "@/types/prescription";

interface FileUploadZoneProps {
  onFileAccepted: (file: UploadedFile) => void;
  ocrProgress: OCRProgress | null;
  onCancel: () => void;
}

const FileUploadZone = ({ onFileAccepted, ocrProgress, onCancel }: FileUploadZoneProps) => {
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    
    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (!isImage && !isPDF) {
      setError("Please upload an image (JPG, PNG) or PDF file");
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    
    // Create preview
    const preview = URL.createObjectURL(file);
    const uploadedFile: UploadedFile = {
      file,
      preview,
      type: isImage ? "image" : "pdf"
    };
    
    setPreviewFile(uploadedFile);
    onFileAccepted(uploadedFile);
  }, [onFileAccepted]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
    disabled: ocrProgress?.status === "processing" || ocrProgress?.status === "loading"
  });

  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) processFile(file);
    };
    input.click();
  };

  const clearFile = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.preview);
    }
    setPreviewFile(null);
    setError(null);
    onCancel();
  };

  const isProcessing = ocrProgress?.status === "processing" || ocrProgress?.status === "loading";

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 md:p-12 transition-all cursor-pointer
          ${isDragActive 
            ? "border-primary bg-accent" 
            : "border-upload-zone-border bg-upload-zone-bg hover:border-primary/50"
          }
          ${isProcessing ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input {...getInputProps()} aria-label="File upload" />
        
        <div className="text-center">
          <motion.div
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            <Upload className="w-8 h-8 text-primary" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragActive ? "Drop your file here" : "Drag & drop your prescription"}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Supports JPG, PNG, and PDF files up to 10MB
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button type="button" variant="outline" className="gap-2">
              <FileImage className="w-4 h-4" />
              Browse Files
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCameraCapture();
              }}
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-xl p-4 shadow-card-elevated"
          >
            <div className="flex items-start gap-4">
              {/* Preview Thumbnail */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                {previewFile.type === "image" ? (
                  <img 
                    src={previewFile.preview} 
                    alt="Prescription preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground truncate">
                      {previewFile.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(previewFile.file.size / 1024).toFixed(1)} KB • {previewFile.type.toUpperCase()}
                    </p>
                  </div>
                  
                  {!isProcessing && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={clearFile}
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                {/* OCR Progress */}
                {ocrProgress && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{ocrProgress.message}</span>
                      <span className="text-primary font-medium">{ocrProgress.progress}%</span>
                    </div>
                    <Progress value={ocrProgress.progress} className="h-2" />
                    
                    {isProcessing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 text-destructive"
                        onClick={clearFile}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-4"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Processing your prescription...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;
