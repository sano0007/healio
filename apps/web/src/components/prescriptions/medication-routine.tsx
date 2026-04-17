"use client";

import {CheckCircle2, Clock, CloudSun, Moon, Sun} from "lucide-react";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {AnimatePresence, motion} from "framer-motion";
import type {Prescription} from "@/lib/api";

interface MedicationRoutineProps {
    prescriptions: Prescription[];
}

const timeSlots = [
  { id: "morning", label: "Morning", icon: Sun, time: "08:00 AM" },
  { id: "noon", label: "Afternoon", icon: CloudSun, time: "01:00 PM" },
  { id: "evening", label: "Evening", icon: Moon, time: "08:00 PM" },
];

export function MedicationRoutine({prescriptions}: MedicationRoutineProps) {
  const [activeSlot, setActiveSlot] = useState("morning");

    if (prescriptions.length === 0) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-brand-black tracking-tight">Daily Medication Routine</h2>
                        <p className="text-xs font-medium text-gray-400 italic flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-dark"/>
                            No medications prescribed yet
                        </p>
                    </div>
                </div>
                <div className="text-center py-16 text-gray-400 text-sm font-medium italic">
                    Your medication routine will appear here once your doctor issues prescriptions.
                </div>
            </div>
        );
    }

    // Group medications by time of day based on frequency pattern
    const morningMeds = prescriptions.filter((rx) => {
        const freq = rx.medications[0]?.frequency ?? "";
        return freq.includes("1-0-1") || freq.includes("1 - 0 - 1") || freq.includes("morning") || freq.includes("1-0-0") || freq.includes("1 - 0 - 0");
    });
    const noonMeds = prescriptions.filter((rx) => {
        const freq = rx.medications[0]?.frequency ?? "";
        return freq.includes("0-1-1") || freq.includes("0 - 1 - 1") || freq.includes("afternoon") || freq.includes("0-1-0") || freq.includes("0 - 1 - 0");
    });
    const eveningMeds = prescriptions.filter((rx) => {
        const freq = rx.medications[0]?.frequency ?? "";
        return freq.includes("0-0-1") || freq.includes("0 - 0 - 1") || freq.includes("evening") || freq.includes("night") || freq.includes("0-0-0") || freq.includes("0 - 0 - 0");
    });

    const slotMeds = activeSlot === "morning" ? morningMeds : activeSlot === "noon" ? noonMeds : eveningMeds;

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-brand-black tracking-tight">Daily Medication Routine</h2>
                    <p className="text-xs font-medium text-gray-400 italic flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-dark"/>
                        You have <span
                        className="text-brand-dark font-bold">{prescriptions.length}</span> medication{prescriptions.length !== 1 ? "s" : ""} total
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
            {slotMeds.length === 0 ? (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="col-span-full text-center py-8 text-gray-400 text-xs italic"
            >
                No medications for this time of day
            </motion.div>
            ) : (
                slotMeds.map((rx, i) => {
                    const med = rx.medications[0];
                    return (
                        <motion.div
                            key={`${rx._id}-${i}`}
                            initial={{opacity: 0, scale: 0.95, y: 10}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.4, delay: i * 0.05}}
                            className="p-6 rounded-[2rem] border border-gray-100 hover:border-brand-light/30 shadow-sm bg-white transition-all flex flex-col justify-between h-40"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold truncate tracking-tight text-brand-black">
                                        {med?.name ?? "—"}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {med?.dosage ?? "—"} • {med?.frequency ?? "—"}
                                    </p>
                                </div>
                  </div>
                            <Button variant="dark" size="sm"
                                    className="h-10 rounded-xl text-[9px] font-bold gap-2 uppercase tracking-widest w-full">
                                Mark as Taken
                                <CheckCircle2 className="w-3.5 h-3.5"/>
                            </Button>
                        </motion.div>
                    );
                })
            )}
        </AnimatePresence>
      </div>

      {/* 3. Slot Summary */}
      <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-dark"/>
                <span
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{morningMeds.length} Morning</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-light"/>
                <span
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{noonMeds.length} Afternoon</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"/>
                <span
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{eveningMeds.length} Evening</span>
            </div>
        </div>
      </div>
    </div>
  );
}