"use client";

import { CloudUpload, X, FileText, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<Array<{ name: string, size: string, progress: number, status: "uploading" | "complete" }>>([]);

  const handleSimulateUpload = () => {
    const newFile = { name: "Blood_Test_Dec_2026.pdf", size: "1.2 MB", progress: 0, status: "uploading" as const };
    setFiles([...files, newFile]);

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setFiles(prev => prev.map(f => f.name === newFile.name ? { ...f, progress: p, status: p >= 100 ? "complete" : "uploading" } : f));
      if (p >= 100) clearInterval(interval);
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* 1. Modal Header */}
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-brand-black tracking-tight">Upload Medical Records</h2>
                <p className="text-xs text-gray-400 font-medium mt-1">Files are encrypted and stored securely.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-gray-50">
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            {/* 2. Drag & Drop Zone */}
            <div className="p-8 space-y-6">
              <div 
                onClick={handleSimulateUpload}
                className="group border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-light/30 hover:bg-brand-light/5 transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-dark group-hover:bg-brand-light/20 transition-colors">
                  <CloudUpload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-brand-black">Drag & drop files here</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supports PDF, PNG, JPG (Max 20MB)</p>
                </div>
              </div>

              {/* 3. File List Overlay */}
              <div className="space-y-3">
                {files.map((file, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-dark border border-gray-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-bold text-brand-black truncate">{file.name}</p>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{file.size}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className="h-full bg-brand-dark rounded-full"
                        />
                      </div>
                    </div>
                    {file.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="text-[10px] font-bold text-brand-dark animate-pulse">{file.progress}%</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-amber-900 leading-relaxed">
                  Ensure the patient name and date are clearly visible on the document before uploading.
                </p>
              </div>
            </div>

            {/* 4. Modal Footer */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onClose} className="rounded-xl h-12 px-6 text-xs font-bold border-gray-100 bg-white">
                  Cancel
                </Button>
                <Button variant="dark" disabled={files.some(f => f.status === "uploading")} className="rounded-xl h-12 px-8 text-xs font-bold shadow-xl shadow-brand-dark/10">
                  Save All Records
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
