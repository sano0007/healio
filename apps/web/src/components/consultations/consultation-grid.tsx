'use client';

import { MicOff, CameraOff, Fullscreen, Maximize2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsultationGridProps {
  doctorImage: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSidebarOpen: boolean;
}

export function ConsultationGrid({
  doctorImage,
  isMuted,
  isCameraOff,
  isSidebarOpen,
}: ConsultationGridProps) {
  return (
    <div
      className={cn(
        'relative flex-1 bg-brand-black transition-all duration-500',
        isSidebarOpen ? 'mr-[400px]' : 'mr-0',
      )}
    >
      {/* 1. Main Doctor Feed (Primary) */}
      <div className="absolute inset-4 rounded-[2.5rem] overflow-hidden border border-white/5 bg-gray-900 group shadow-2xl">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src={doctorImage}
          className="w-full h-full object-cover opacity-80 blur-[2px] scale-105"
          alt="Doctor stream"
        />

        {/* Subtle cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-brand-black/20" />

        {/* Live Status Overlay */}
        <div className="absolute bottom-10 left-10 flex items-center gap-2 group-hover:scale-105 transition-transform origin-left">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest shadow-sm">
            Live Stream
          </span>
        </div>

        {/* Doctor Name HUD */}
        <div className="absolute top-10 left-10 px-4 py-2 bg-brand-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hidden group-hover:block transition-all animate-in fade-in zoom-in-95 duration-300">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">
            Consulting Specialist
          </span>
        </div>
      </div>

      {/* 2. Patient Preview (Picture-in-Picture) */}
      <motion.div
        layout
        className="absolute top-10 right-10 w-48 h-64 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-gray-800 z-10 group/patient"
      >
        <div className="w-full h-full relative">
          {/* Mock Person Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/20 backdrop-blur-sm">
            <User className="w-20 h-20 text-white/10" />
          </div>

          <div
            className={cn(
              'absolute inset-0 bg-brand-black/40 flex items-center justify-center transition-opacity',
              isCameraOff ? 'opacity-100' : 'opacity-0',
            )}
          >
            <CameraOff className="w-10 h-10 text-white/50" />
          </div>

          <div className="absolute bottom-3 left-3 bg-brand-black/60 px-2 py-1 rounded-lg border border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              You
            </span>
            {isMuted && <MicOff className="w-3 h-3 text-rose-500" />}
          </div>
        </div>
      </motion.div>

      {/* 3. Utility Controls overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 group">
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-black/40 backdrop-blur-xl rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <Fullscreen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Minimal Button helper if component is missing
function Button({ children, className, variant, size, ...props }: any) {
  return (
    <button
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  );
}
