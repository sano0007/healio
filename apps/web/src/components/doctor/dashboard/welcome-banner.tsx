"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, ShieldCheck, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function WelcomeBanner() {
  const [status, setStatus] = useState<"online" | "busy" | "offline">("online");
  const doctorName = "Sarah Johnson"; // Mock data

  const statusColors = {
    online: "text-emerald-500 bg-emerald-50 border-emerald-100",
    busy: "text-orange-500 bg-orange-50 border-orange-100",
    offline: "text-gray-400 bg-gray-50 border-gray-100",
  };

  return (
    <div className="relative overflow-hidden p-10 lg:p-14 bg-brand-dark rounded-[3.5rem] text-white shadow-2xl shadow-brand-dark/20 group">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-light/5 rounded-full blur-[100px] -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-8 max-w-2xl">
          {/* Header Vitals */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Calendar className="w-4 h-4 text-brand-light" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Clock className="w-4 h-4 text-brand-light" />
              <span className="text-[11px] font-bold uppercase tracking-widest">09:12 AM</span>
            </div>
          </motion.div>

          {/* Greeting */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Good Morning, <br />
              <span className="text-brand-light italic">Dr. {doctorName}</span>
            </h1>
            <p className="text-lg text-brand-light/60 font-medium max-w-lg leading-relaxed">
              You have <span className="text-white font-bold">12 appointments</span> scheduled for today. Your first patient is arriving in <span className="text-white font-bold">45 minutes</span>.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-100 overflow-hidden shadow-xl">
                  <img src={`/images/doctor-${i}.png`} alt={`Patient ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                +8
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-light" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">HIPAA Compliant Session</span>
            </div>
          </div>
        </div>

        {/* Status Control Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 p-8 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 space-y-8 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-light">Availability</span>
              <Activity className={cn("w-4 h-4 transition-colors", status === "online" ? "text-emerald-400" : "text-gray-400")} />
            </div>
            
            <div className="space-y-3">
              {(["online", "busy", "offline"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "w-full px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group/btn",
                    status === s 
                      ? "bg-white text-brand-dark border-transparent shadow-xl" 
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest">{s}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    s === "online" ? "bg-emerald-500" : s === "busy" ? "bg-orange-500" : "bg-gray-400",
                    status === s ? "scale-125" : "scale-100 group-hover/btn:scale-110"
                  )} />
                </button>
              ))}
            </div>
          </div>

          <button className="w-full h-14 bg-brand-light text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg active:scale-[0.98]">
            Edit Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
