"use client";

import { FileText, Stethoscope, Pill, Info, ClipboardList, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ClinicalOutcomeProps {
  diagnosis: string;
  notes: string;
  prescriptions: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

export function ClinicalOutcome({ diagnosis, notes, prescriptions }: ClinicalOutcomeProps) {
  return (
    <div className="space-y-8">
      {/* 1. Diagnosis & Notes */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Diagnosis</h3>
          </div>
          <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
            <p className="text-sm font-bold text-brand-black leading-relaxed">{diagnosis}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Doctor's Clinical Notes</h3>
          </div>
          <div className="p-8 bg-gray-50/10 rounded-[2.5rem] border border-gray-100 min-h-[160px]">
            <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
              "{notes}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Digital Prescription List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Prescribed Medication</h3>
          </div>
          <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Digitally Signed</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {prescriptions.map((med, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 transition-all hover:border-brand-light/20 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark shrink-0">
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-brand-black">{med.name}</h4>
                  <span className="text-[10px] font-bold text-brand-dark opacity-60 uppercase">{med.duration}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    <Info className="w-3 h-3" />
                    Dosage: {med.dosage}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                    <Clock className="w-3 h-3" />
                    Freq: {med.frequency}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
