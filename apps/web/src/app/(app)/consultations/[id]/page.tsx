"use client";

import { use, useState, useEffect } from "react";
import { ConsultationHUD } from "@/components/consultations/consultation-hud";
import { ConsultationGrid } from "@/components/consultations/consultation-grid";
import { ConsultationControls } from "@/components/consultations/consultation-controls";
import { ConsultationSidebar } from "@/components/consultations/consultation-sidebar";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Media State
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isAudioOff, setIsAudioOff] = useState(false);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isJoining, setIsJoining] = useState(true);

  // Mock Doctor Info
  const doctor = {
    name: "Dr. Sarah Johnson",
    specialty: "Senior Cardiologist",
    image: "/images/doctor-1.png",
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsJoining(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEndCall = () => {
    // Navigate to appointment detail summary after ending
    router.push(`/appointments/${resolvedParams.id}`);
  };

  return (
    <div className="relative h-full flex flex-col bg-brand-black">
      {/* 1. Joining Overlay */}
      <AnimatePresence>
        {isJoining && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
               <div className="w-24 h-24 rounded-full border-2 border-brand-light/20 flex items-center justify-center animate-spin-slow">
                 <div className="w-16 h-16 rounded-full border-t-2 border-brand-light animate-spin" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 rounded-full border border-brand-light/5 animate-ping" />
               </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Connecting to Clinical Session</h2>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Authenticating Secure Bridge...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Heads-Up Display (Overlay) */}
      {!isJoining && (
        <ConsultationHUD 
          doctorName={doctor.name}
          doctorSpecialty={doctor.specialty}
          doctorImage={doctor.image}
        />
      )}

      {/* 3. Main Video Display Layer */}
      {!isJoining && (
        <div className="flex-1 relative flex overflow-hidden">
          <ConsultationGrid 
             doctorImage={doctor.image}
             isMuted={isMuted}
             isCameraOff={isCameraOff}
             isSidebarOpen={isSidebarOpen}
          />
          
          <ConsultationSidebar isOpen={isSidebarOpen} />
        </div>
      )}

      {/* 4. Interaction Control Layer */}
      {!isJoining && (
        <ConsultationControls 
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          isCameraOff={isCameraOff}
          onToggleCamera={() => setIsCameraOff(!isCameraOff)}
          isAudioOff={isAudioOff}
          onToggleAudio={() => setIsAudioOff(!isAudioOff)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onEndCall={handleEndCall}
        />
      )}

      {/* 5. Immersive Gradient Background (Edge Cases) */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-black to-transparent pointer-events-none opacity-40" />
    </div>
  );
}
