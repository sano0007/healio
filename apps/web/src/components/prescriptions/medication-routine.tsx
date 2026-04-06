"use client";

import { Sun, CloudSun, Moon, CheckCircle2, AlertCircle, Clock, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
  { id: "morning", label: "Morning", icon: Sun, time: "08:00 AM" },
  { id: "noon", label: "Afternoon", icon: CloudSun, time: "01:00 PM" },
  { id: "evening", label: "Evening", icon: Moon, time: "08:00 PM" },
];

const mockRoutine = {
  morning: [
    { id: "1", name: "Metformin", dosage: "500 mg", instructions: "Before meal", taken: true },
    { id: "2", name: "Lisinopril", dosage: "10 mg", instructions: "With water", taken: false },
  ],
  noon: [
    { id: "3", name: "Vitamin D3", dosage: "1000 IU", instructions: "After lunch", taken: false },
  ],
  evening: [
    { id: "4", name: "Metformin", dosage: "500 mg", instructions: "After dinner", taken: false },
    { id: "5", name: "Atorvastatin", dosage: "20 mg", instructions: "Before sleep", taken: false },
  ],
};

export function MedicationRoutine() {
  const [activeSlot, setActiveSlot] = useState("morning");

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-brand-black tracking-tight">Daily Medication Routine</h2>
          <p className="text-xs font-medium text-gray-400 italic flex items-center gap-1.5">
             <Clock className="w-3.5 h-3.5 text-brand-dark" />
             Next dose in <span className="text-brand-dark font-bold">45 minutes</span>
          </p>
        </div>

        {/* 1. Time Slot Selector */}
        <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100 relative items-center">
          {timeSlots.map((slot) => {
            const isActive = activeSlot === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setActiveSlot(slot.id)}
                className={cn(
                  "relative px-4 py-2.5 flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 min-w-0 h-10",
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-slot-background"
                    className="absolute inset-x-0 inset-y-0 bg-brand-dark rounded-xl z-0 shadow-lg shadow-brand-dark/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <slot.icon className="w-4 h-4" size={16} />
                  <span className="hidden sm:inline">{slot.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slot Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {mockRoutine[activeSlot as keyof typeof mockRoutine].map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-40",
                med.taken ? "bg-emerald-50 border-emerald-100" : "bg-white border-gray-100 hover:border-brand-light/30 shadow-sm"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <h3 className={cn("text-sm font-bold truncate tracking-tight", med.taken ? "text-emerald-700" : "text-brand-black")}>
                     {med.name}
                   </h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{med.dosage} • {med.instructions}</p>
                </div>
                {med.taken && (
                  <div className="p-1 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/20">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!med.taken && (
                <Button variant="dark" size="sm" className="h-10 rounded-xl text-[9px] font-bold gap-2 uppercase tracking-widest w-full">
                   Mark as Taken
                   <CheckCircle2 className="w-3.5 h-3.5" />
                </Button>
              )}
              {med.taken && (
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest text-center">Successfully Logged</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. Slot Summary */}
      <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">3 Items Logged</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-brand-dark" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">2 Items Pending</span>
           </div>
        </div>
        <div className="px-4 py-1 bg-brand-light/10 rounded-full border border-brand-light/20 flex items-center gap-1.5">
           <AlertCircle className="w-3 h-3 text-brand-dark" />
           <span className="text-[9px] font-bold text-brand-dark uppercase tracking-widest">Sync with health app</span>
        </div>
      </div>
    </div>
  );
}
