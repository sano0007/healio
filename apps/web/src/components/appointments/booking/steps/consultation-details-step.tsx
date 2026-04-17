'use client';

import {
  MessageSquare,
  Upload,
  FileBox,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ConsultationDetailsStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export function ConsultationDetailsStep({
  onNext,
  onBack,
}: ConsultationDetailsStepProps) {
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  const handleFileUpload = (e: any) => {
    const newFiles = Array.from(e.target.files).map((f: any) => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      {/* 1. Reason for Visit */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-black">
            Reason for visit
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Please describe your symptoms or the reason for this consultation.
          </p>
        </div>

        <div className="relative">
          <textarea
            placeholder="Describe your concern here..."
            className="w-full h-40 px-6 py-5 rounded-[2rem] border border-gray-100 focus:outline-none focus:border-brand-dark text-sm bg-gray-50/30 resize-none font-medium leading-relaxed"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="absolute top-5 right-6 text-brand-dark/20">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Document Upload */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-brand-black">
            Upload medical reports (Optional)
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            You can upload previous reports, prescriptions, or photos for the
            doctor to review.
          </p>
        </div>

        <div className="relative group border-2 border-dashed border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center transition-all hover:border-brand-light/30 hover:bg-brand-light/5">
          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileUpload}
          />
          <div className="w-16 h-16 rounded-3xl bg-white shadow-lg shadow-brand-dark/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <Upload className="w-8 h-8 text-brand-dark" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-brand-black mb-1">
              Click to upload or drag and drop
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Supports PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {files.map((file, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-dark shadow-sm">
                      <FileBox className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-black truncate max-w-[120px]">
                        {file.name}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">
                        {file.size}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-gray-400 hover:text-rose-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-10 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-14 px-8 rounded-2xl text-sm font-bold gap-2 border-brand-light/20"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          variant="dark"
          onClick={() => onNext({ reason, files })}
          className="h-14 px-10 rounded-2xl text-sm font-bold gap-2 shadow-xl shadow-brand-dark/10"
        >
          Review & Pay
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
