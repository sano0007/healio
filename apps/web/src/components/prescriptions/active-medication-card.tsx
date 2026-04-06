"use client";

import { Pill, Clock, Calendar, CheckCircle2, AlertCircle, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActiveMedCardProps {
  name: string;
  dosage: string;
  frequency: string; // e.g. "1 - 0 - 1"
  duration: string; // e.g. "14 Days"
  daysRemaining: number;
  totalDays: number;
  nextDose: string;
  instruction: string;
  type: "chronic" | "acute";
}

export function ActiveMedCard({ 
  name, dosage, frequency, duration, daysRemaining, totalDays, nextDose, instruction, type 
}: ActiveMedCardProps) {
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;
  const isRefillLow = daysRemaining <= 3;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-brand-light/30 h-full flex flex-col"
    >
      {/* 1. Card Header (Branding & Type) */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-light/10 flex items-center justify-center text-brand-dark border border-brand-light/20 transition-transform group-hover:scale-110">
          <Pill className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
            type === "chronic" ? "text-blue-600 bg-blue-50 border-blue-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
          )}>
            {type === "chronic" ? "Chronic Therapy" : "Acute Therapy"}
          </span>
          {isRefillLow && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 rounded-lg border border-rose-100 animate-pulse">
               <AlertCircle className="w-3 h-3 text-rose-500" />
               <span className="text-[8px] font-bold text-rose-600 uppercase tracking-widest">Refill Soon</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-brand-black tracking-tight group-hover:text-brand-dark transition-colors">{name}</h3>
          <p className="text-xs font-medium text-gray-400">{dosage} • {instruction}</p>
        </div>

        {/* 3. Clinical HUD (Frequency & Progress) */}
        <div className="p-4 bg-gray-50 rounded-3xl space-y-4 border border-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Schedule
              </p>
              <p className="text-sm font-black text-brand-black tracking-widest uppercase">{frequency}</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Next Dose</p>
               <p className="text-xs font-bold text-brand-dark">{nextDose}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
              <span className="text-gray-400">Therapy Progress</span>
              <span className="text-brand-dark">{daysRemaining} days left</span>
            </div>
            <div className="h-2 w-full bg-white rounded-full border border-gray-100 overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-dark rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Actions */}
      <div className="pt-6 flex items-center justify-between gap-3">
        <Button variant="ghost" className="h-10 rounded-2xl px-4 text-[10px] font-bold gap-2 text-gray-400 hover:text-brand-dark hover:bg-brand-light/10">
          <Info className="w-4 h-4" />
          Details
        </Button>
        <Button variant="dark" className="h-12 flex-1 rounded-2xl text-[10px] font-bold gap-2 shadow-lg shadow-brand-dark/10 group/btn">
          Mark as Taken
          <CheckCircle2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
        </Button>
      </div>
    </motion.div>
  );
}
