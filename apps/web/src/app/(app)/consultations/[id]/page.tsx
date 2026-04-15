"use client";

import { use, useState, useEffect } from "react";
import { ConsultationHUD } from "@/components/consultations/consultation-hud";
import { ConsultationGrid } from "@/components/consultations/consultation-grid";
import { ConsultationControls } from "@/components/consultations/consultation-controls";
import { ConsultationSidebar } from "@/components/consultations/consultation-sidebar";
import { TwilioVideoRoom } from "@/components/consultations/twilio-video-room";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateSession, useEndSession } from "@/hooks/use-sessions";

export default function ConsultationRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const appointmentId = resolvedParams.id;

  const createSession = useCreateSession();
  const endSession = useEndSession();

  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    token?: string;
    roomName: string;
  } | null>(null);

  const [doctor, setDoctor] = useState<{
    name: string;
    specialty: string;
    image: string;
  }>({
    name: "Doctor",
    specialty: "Specialist",
    image: "/images/doctor-placeholder.png",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await createSession.mutateAsync(appointmentId);
        
        setSessionData({
          sessionId: result.sessionId,
          token: result.token,
          roomName: result.roomName,
        });

        setDoctor({
          name: "Dr. Sarah Johnson",
          specialty: "Senior Cardiologist",
          image: "/images/doctor-1.png",
        });
      } catch (err: any) {
        console.error("Failed to create session:", err);
        setError(err.message || "Failed to connect to video session");
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [appointmentId]);

  const handleEndCall = async () => {
    if (sessionData?.sessionId) {
      try {
        await endSession.mutateAsync(sessionData.sessionId);
      } catch (err) {
        console.error("Failed to end session:", err);
      }
    }
    router.push(`/appointments/${appointmentId}`);
  };

  if (isLoading) {
    return (
      <div className="relative h-full flex flex-col bg-brand-black">
        <motion.div 
          initial={{ opacity: 1 }}
          className="absolute inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center gap-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-brand-light/20 flex items-center justify-center">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-full flex flex-col bg-brand-black">
        <div className="absolute inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center gap-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-red-400 tracking-tight">Connection Failed</h2>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col bg-brand-black">
      {/* 1. Heads-Up Display (Overlay) */}
      <ConsultationHUD 
        doctorName={doctor.name}
        doctorSpecialty={doctor.specialty}
        doctorImage={doctor.image}
      />

      {/* 2. Main Video Display Layer */}
      <div className="flex-1 relative flex overflow-hidden">
        {sessionData?.token ? (
          <TwilioVideoRoom
            token={sessionData.token}
            roomName={sessionData.roomName}
            onError={(err) => setError(err.message)}
          />
        ) : (
          <ConsultationGrid 
            doctorImage={doctor.image}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        
        <ConsultationSidebar isOpen={isSidebarOpen} />
      </div>

      {/* 3. Interaction Control Layer */}
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

      {/* 4. Immersive Gradient Background (Edge Cases) */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-black to-transparent pointer-events-none opacity-40" />
    </div>
  );
}