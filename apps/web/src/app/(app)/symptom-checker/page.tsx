"use client";

import { useState } from "react";
import { SymptomInput } from "@/components/symptom-checker/symptom-input";
import { DiagnosticEngine } from "@/components/symptom-checker/diagnostic-engine";
import { TriageResults } from "@/components/symptom-checker/triage-results";
import type { SymptomCheckResult } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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
              Powered by <span className="text-brand-dark font-black">Healio AI</span>.
            </p>
          </div>
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

    </div>
  );
}
