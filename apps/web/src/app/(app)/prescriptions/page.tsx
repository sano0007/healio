"use client";

import { useState, useEffect } from "react";
import { PrescriptionHeader } from "@/components/prescriptions/prescription-header";
import { MedicationRoutine } from "@/components/prescriptions/medication-routine";
import { ActiveMedCard } from "@/components/prescriptions/active-medication-card";
import { PrescriptionHistory } from "@/components/prescriptions/prescription-history";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const activeMeds = [
  { 
    id: "1", 
    name: "Metformin", 
    dosage: "500 mg", 
    frequency: "1 - 0 - 1", 
    duration: "90 Days", 
    daysRemaining: 64, 
    totalDays: 90, 
    nextDose: "08:00 PM", 
    instruction: "After meal", 
    type: "chronic" as const 
  },
  { 
    id: "2", 
    name: "Lisinopril", 
    dosage: "10 mg", 
    frequency: "1 - 0 - 0", 
    duration: "30 Days", 
    daysRemaining: 12, 
    totalDays: 30, 
    nextDose: "Tomorrow, 08:00 AM", 
    instruction: "With water", 
    type: "chronic" as const 
  },
  { 
    id: "3", 
    name: "Amoxicillin", 
    dosage: "500 mg", 
    frequency: "1 - 1 - 1", 
    duration: "10 Days", 
    daysRemaining: 2, 
    totalDays: 10, 
    nextDose: "01:00 PM", 
    instruction: "Complete course", 
    type: "acute" as const 
  },
];

export default function PrescriptionsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-12 mb-20">
      {/* 1. Header & Quick Summary */}
      <PrescriptionHeader />

      {/* 2. Visual Medication Routine Hub */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-brand-dark rounded-full" />
           <h2 className="text-xl font-bold text-brand-black tracking-tight uppercase tracking-widest text-[11px] leading-none">Daily Health Routine</h2>
        </div>
        <MedicationRoutine />
      </section>

      {/* 3. Active Meds Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
               <h2 className="text-xl font-bold text-brand-black tracking-tight uppercase tracking-widest text-[11px] leading-none">Active Therapies</h2>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark cursor-pointer transition-colors">See all active medications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-50 rounded-[2.5rem] p-8 space-y-6 animate-pulse border border-gray-100">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <div className="pt-6 border-t border-gray-100">
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))
            ) : (
              activeMeds.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ActiveMedCard {...med} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Prescription History Table */}
      <section className="space-y-8 pt-10">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
           <h2 className="text-xl font-bold text-brand-black tracking-tight uppercase tracking-widest text-[11px] leading-none">Clinical History Archive</h2>
        </div>
        <PrescriptionHistory />
      </section>

      {/* 5. Health Compliance Overlay */}
      <div className="p-10 bg-brand-black rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-3">
            <h3 className="text-2xl font-bold tracking-tight">Personalized Health Compliance</h3>
            <p className="text-sm text-white/50 max-w-xl font-medium leading-relaxed">
              Tracking your medication compliance helps doctors adjust your treatment plan more accurately. Keep your routine updated for better clinical outcomes.
            </p>
         </div>
         <Button variant="outline" className="relative z-10 h-14 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/10 text-white shadow-xl">
            View Analytics Hub
         </Button>
         {/* Immersive BG Decoration */}
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-light/10 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
}
