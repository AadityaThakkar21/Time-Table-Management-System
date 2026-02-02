import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, FileSpreadsheet, Loader2, X, CheckCircle2 } from "lucide-react";
import { useUploadFile } from "@/hooks/use-files";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadFile, isPending } = useUploadFile();

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Basic validation for excel files
    if (file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setSelectedFile(file);
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile, {
        onSuccess: () => {
          setSelectedFile(null);
        }
      });
    }
  };

  const clearFile = () => setSelectedFile(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "relative group cursor-pointer rounded-3xl border-3 border-dashed border-border transition-all duration-300 ease-in-out bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-lg",
              dragActive && "border-primary bg-primary/5 shadow-xl scale-[1.01]"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="mb-6 p-4 rounded-full bg-primary/5 text-primary ring-1 ring-primary/20 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-2 text-foreground">
                Upload Master Schedule
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                Drag and drop your Excel file here, or click to browse. Supports .xlsx and .xls formats.
              </p>
              <div className="px-4 py-1.5 rounded-full bg-secondary text-xs font-medium text-secondary-foreground border border-border">
                Max file size: 10MB
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground truncate max-w-[200px] sm:max-w-md">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {!isPending && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {isPending ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary text-sm font-medium animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing schedule and generating timetables...
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={handleUpload}
                    size="lg"
                    className="w-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Generate Timetable
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
