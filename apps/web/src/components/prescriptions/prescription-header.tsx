"use client";

import { Activity, Bell, Calendar, Plus, ShieldCheck, HeartPulse, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PrescriptionHeader() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-brand-black tracking-tight flex items-center gap-4">
          My Prescriptions
          <div className="px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-1.5 h-7 self-center mt-1 text-emerald-500">
             <ShieldCheck className="w-3.5 h-3.5" size={14} strokeWidth={3} />
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">Clinical Security</span>
          </div>
        </h1>
        <div className="flex items-center gap-6">
          <p className="text-xs text-gray-400 font-medium italic">
            You have <span className="text-brand-dark font-black">5 Active</span> medications.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Reminders</span>
            <button 
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                remindersEnabled ? "bg-brand-dark" : "bg-gray-200"
              )}
            >
              <motion.div 
                animate={{ x: remindersEnabled ? 24 : 2 }}
                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Prescription Summary (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-8 pr-10 border-r border-gray-100">
           <PrescriptionStat icon={<Activity className="text-brand-dark" />} label="Refills Due" value="02" />
           <PrescriptionStat icon={<HeartPulse className="text-rose-500" />} label="Health Score" value="98%" />
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-12 px-6 text-xs font-bold gap-2 border-gray-100 hover:bg-gray-50">
             <Calendar className="w-4 h-4" />
             Sync Calendar
           </Button>
           <Button variant="dark" className="rounded-2xl h-12 px-8 text-xs font-bold gap-2 shadow-xl shadow-brand-dark/10">
             <Plus className="w-4 h-4" />
             Add Medication
           </Button>
        </div>
      </div>
    </div>
  );
}

function PrescriptionStat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-brand-black">{value}</p>
      </div>
    </div>
  );
}
