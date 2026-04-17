"use client";

import {AlertCircle, CheckCircle2, CloudUpload, FileText, ShieldCheck, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import {useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {getAccessToken, getUserIdFromToken} from "@/lib/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;

    const newFiles: FileItem[] = Array.from(selected).map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      size: formatSize(f.size),
      progress: 0,
      status: "pending" as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    console.log('[Upload] handleSave called, files:', files.length, 'isUploading:', isUploading);
    if (!files.length || isUploading) {
      console.log('[Upload] early return');
      return;
    }

    try {
      setIsUploading(true);
      const token = getAccessToken();
      const userId = getUserIdFromToken();
      console.log('[Upload] handleSave');
      console.log('[Upload] - getAccessToken():', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('[Upload] - getUserIdFromToken():', userId);
      console.log('[Upload] - files to upload:', files.filter(f => f.status === "pending").length);
      if (!userId) throw new Error('Not authenticated');

      for (const fileItem of files.filter(f => f.status === "pending")) {
        await uploadSingleFile(fileItem, userId, token);
      }
    } catch (err) {
      console.error('[Upload] handleSave error:', err);
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      queryClient.invalidateQueries({queryKey: ['records']});
    }
  };

  const uploadSingleFile = async (fileItem: FileItem, _patientId: string, token: string | null) => {
    try {
      console.log('[Upload] Starting:', fileItem.name);
      setFiles(prev => prev.map(f => f.id === fileItem.id ? {...f, status: "uploading" as const} : f));

      const formData = new FormData();
      formData.append('file', fileItem.file);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const url = `${API_BASE}/patients/me/reports`;
      const authHeader = token ? `Bearer ${token}` : null;
      console.log('[Upload] POST to:', url);
      console.log('[Upload] authHeader:', authHeader ? `${authHeader.substring(0, 25)}...` : 'MISSING');
      console.log('[Upload] getAccessToken():', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('[Upload] localStorage healio_token:', localStorage.getItem('healio_token') ? `${localStorage.getItem('healio_token')!.substring(0, 20)}...` : 'null');

      const res = await fetch(url, {
        method: 'POST',
        headers: authHeader ? {Authorization: authHeader} : {},
        body: formData,
      });

      console.log('[Upload] Response status:', res.status, 'ok:', res.ok, 'type:', res.type);
      const text = await res.text();
      console.log('[Upload] Response body:', text.substring(0, 300));
      if (!res.ok) {
        console.error('[Upload] Failed:', text);
        throw new Error('Upload failed');
      }

      // Animate progress to 100
      for (let p = 10; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 80));
        setFiles(prev => prev.map(f => f.id === fileItem.id ? {...f, progress: p} : f));
      }

      setFiles(prev => prev.map(f => f.id === fileItem.id ? {...f, progress: 100, status: "complete" as const} : f));
      console.log('[Upload] Complete:', fileItem.name);
    } catch (err) {
      console.error('[Upload] Error:', err);
      setFiles(prev => prev.map(f => f.id === fileItem.id ? {...f, status: "error" as const} : f));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleClose = () => {
    setFiles([]);
    setIsUploading(false);
    onClose();
  };

  const pendingCount = files.filter(f => f.status === "pending").length;
  const completeCount = files.filter(f => f.status === "complete").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-gray-50">
                <X className="w-5 h-5 text-gray-400" />
              </Button>
            </div>

            {/* 2. Drag & Drop Zone */}
            <div className="p-8 space-y-6">
              <label
                className="group border-2 border-dashed border-gray-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-light/30 hover:bg-brand-light/5 transition-all text-center"
              >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-brand-dark group-hover:bg-brand-light/20 transition-colors">
                  <CloudUpload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-brand-black">Click to select files</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supports PDF, PNG, JPG
                    (Max 10MB)</p>
                </div>
              </label>

              {/* 3. File List Overlay */}
              <div className="space-y-3">
                {files.map((file) => (
                    <div key={file.id}
                         className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
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
                          className={cn("h-full rounded-full", file.status === "error" ? "bg-red-500" : file.status === "complete" ? "bg-emerald-500" : "bg-brand-dark")}
                        />
                      </div>
                    </div>
                    {file.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : file.status === "error" ? (
                        <X className="w-5 h-5 text-red-500"/>
                    ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{file.status}</span>
                    )}
                      {file.status === "pending" && !isUploading && (
                          <button onClick={() => removeFile(file.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4"/>
                          </button>
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
                <Button variant="outline" onClick={handleClose}
                        className="rounded-xl h-12 px-6 text-xs font-bold border-gray-100 bg-white">
                  {completeCount > 0 ? "Done" : "Cancel"}
                </Button>
                <Button
                    variant="dark"
                    onClick={handleSave}
                    disabled={pendingCount === 0 || isUploading}
                    className="rounded-xl h-12 px-8 text-xs font-bold shadow-xl shadow-brand-dark/10"
                >
                  {isUploading ? `Uploading ${completeCount}/${files.length}...` : `Save ${pendingCount} Record${pendingCount !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
