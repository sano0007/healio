"use client";

import { Mic, MicOff, Camera, CameraOff, Volume2, VolumeX, PhoneOff, MessageSquare, Menu, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ConsultationControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isCameraOff: boolean;
  onToggleCamera: () => void;
  isAudioOff: boolean;
  onToggleAudio: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onEndCall: () => void;
}

export function ConsultationControls({
  isMuted,
  onToggleMute,
  isCameraOff,
  onToggleCamera,
  isAudioOff,
  onToggleAudio,
  isSidebarOpen,
  onToggleSidebar,
  onEndCall,
}: ConsultationControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-brand-black/20 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
        {/* 1. Media Toggles */}
        <div className="flex items-center gap-1.5 px-3 border-r border-white/10">
          <ControlToggle 
            active={!isMuted} 
            onClick={onToggleMute} 
            icon={isMuted ? <MicOff /> : <Mic />} 
            label="Mic" 
            variant="danger"
          />
          <ControlToggle 
            active={!isCameraOff} 
            onClick={onToggleCamera} 
            icon={isCameraOff ? <CameraOff /> : <Camera />} 
            label="Camera" 
            variant="danger"
          />
          <ControlToggle 
            active={!isAudioOff} 
            onClick={onToggleAudio} 
            icon={isAudioOff ? <VolumeX /> : <Volume2 />} 
            label="Speaker" 
            variant="danger"
          />
        </div>

        {/* 2. End Call Branding */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEndCall}
          className="mx-2 flex items-center justify-center w-14 h-14 bg-rose-500 rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </motion.button>

        {/* 3. Layout Controls */}
        <div className="flex items-center gap-1.5 px-3 border-l border-white/10">
          <ControlToggle 
            active={isSidebarOpen} 
            onClick={onToggleSidebar} 
            icon={<MessageSquare />} 
            label="Chat" 
          />
          <ControlToggle 
            active={false} 
            onClick={() => {}} 
            icon={<LayoutGrid />} 
            label="Layout" 
          />
        </div>
      </div>
    </div>
  );
}

function ControlToggle({ active, onClick, icon, label, variant }: { active: boolean; onClick: () => void; icon: any; label: string; variant?: "danger" }) {
  const isActiveStyle = active 
    ? "bg-white/10 text-white border-white/10" 
    : variant === "danger" 
      ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
      : "bg-brand-black/40 text-white/40 border-white/5";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center w-14 h-16 rounded-2xl border transition-all hover:scale-105 gap-1.5",
        isActiveStyle
      )}
    >
      <div className="flex items-center justify-center w-6 h-6">
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">{label}</span>
    </button>
  );
}
