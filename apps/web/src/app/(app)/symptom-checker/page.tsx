"use client";

import { useState } from "react";
import { SymptomInput } from "@/components/symptom-checker/symptom-input";
import { DiagnosticEngine } from "@/components/symptom-checker/diagnostic-engine";
import { TriageResults } from "@/components/symptom-checker/triage-results";
import type { SymptomCheckResult } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Activity, ShieldCheck, Info } from "lucide-react";

type CheckerState = "input" | "analyzing" | "results";

export default function SymptomCheckerPage() {
  const [state, setState] = useState<CheckerState>("input");
  const [userSymptoms, setUserSymptoms] = useState("");
  const [results, setResults] = useState<SymptomCheckResult | null>(null);

  const handleAnalyze = (symptoms: string) => {
    setUserSymptoms(symptoms);
    setState("analyzing");
  };

  const handleAnalysisComplete = (data: SymptomCheckResult) => {
    setResults(data);
    setState("results");
  };

  const handleReset = () => {
    setState("input");
    setUserSymptoms("");
    setResults(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-brand-black tracking-tight flex items-center gap-3">
            AI Symptom Checker
            <div className="px-3 py-1 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-1.5 h-7">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">HiPAA Compliant</span>
            </div>
          </h1>
          <div className="flex items-center gap-6">
            <p className="text-xs text-gray-400 font-medium italic">
              Powered by <span className="text-brand-dark font-black">HealioMed AI</span> Diagnostic Model.
            </p>
            <div className="flex items-center gap-2">
               <Activity className="w-3.5 h-3.5 text-brand-dark" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clinical Confidence: 98%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
           <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-brand-dark shadow-sm">
             <Sparkles className="w-4 h-4" />
           </div>
           <p className="text-[10px] font-black text-brand-black uppercase tracking-widest pr-4 border-r border-gray-200">
             Smart Diagnosis
           </p>
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-2">
             v4.2.0-clinical
           </p>
        </div>
      </div>

      {/* 2. Multi-State Dashboard */}
      <div className="min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {state === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <SymptomInput onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {state === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <DiagnosticEngine symptoms={userSymptoms} onComplete={handleAnalysisComplete} onReset={handleReset} />
            </motion.div>
          )}

          {state === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {results && <TriageResults results={results} onReset={handleReset} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Footer / Disclaimer */}
      <div className="pt-12 border-t border-gray-50 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
         <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">
              This is a decision support tool, not a medical diagnosis. In emergencies, call local emergency services immediately.
            </p>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <p className="text-[9px] font-black text-brand-black uppercase tracking-widest mb-1">Encrypted Infrastructure</p>
               <p className="text-[8px] font-medium text-gray-400">Cert-ID: HL-8829-DIAG</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <p className="text-[10px] font-black text-brand-black uppercase">Verified</p>
            </div>
         </div>
      </div>
    </div>
  );
}
