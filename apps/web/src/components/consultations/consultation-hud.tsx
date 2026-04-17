'use client';

import { Wifi, Info, ShieldCheck, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

interface ConsultationHUDProps {
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
}

export function ConsultationHUD({
  doctorName,
  doctorSpecialty,
  doctorImage,
}: ConsultationHUDProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-6 z-40 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 1. Patient Left Area */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-brand-black/40 backdrop-blur-3xl rounded-2xl border border-white/10">
            <Avatar
              src={doctorImage}
              className="w-10 h-10 border-2 border-emerald-500/30"
            />
            <div>
              <p className="text-[12px] font-bold text-white leading-none mb-1">
                {doctorName}
              </p>
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                {doctorSpecialty}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Center Timer */}
        <div className="flex flex-col items-center pointer-events-auto">
          <div className="px-6 py-2 bg-brand-black/40 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white font-mono tracking-wider">
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        {/* 3. Signal & Quality HUD */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-4 px-4 py-2 bg-brand-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Signal Quality
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase">
                  Excellent
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
