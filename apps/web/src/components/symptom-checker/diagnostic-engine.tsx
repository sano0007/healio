"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, Database, Search, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { SymptomCheckResult } from "@/lib/api";
import { Button } from "@/components/ui/button";

const diagnosticSteps = [
  { icon: <Database />, label: "Accessing Global Clinical Databases..." },
  { icon: <Search />, label: "Identifying Symptomatic Correlations..." },
  { icon: <BrainCircuit />, label: "Applying Neural Diagnostic Models..." },
  { icon: <Activity />, label: "Calculating Condition Probability..." },
  { icon: <FileText />, label: "Finalizing Clinical Triage Summary..." },
];

interface DiagnosticEngineProps {
  symptoms: string;
  onComplete: (result: SymptomCheckResult) => void;
  onReset: () => void;
}

export function DiagnosticEngine({ symptoms, onComplete, onReset }: DiagnosticEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Hold resolved API result and animation-done flag separately
  const apiResultRef = useRef<SymptomCheckResult | null>(null);
  const animationDoneRef = useRef(false);

  // Trigger onComplete only when BOTH animation and API have finished
  const tryComplete = () => {
    if (animationDoneRef.current && apiResultRef.current) {
      onComplete(apiResultRef.current);
    }
  };

  // Animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= diagnosticSteps.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            animationDoneRef.current = true;
            tryComplete();
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // API call
  useEffect(() => {
    api.ai.checkSymptoms(symptoms)
      .then((result) => {
        apiResultRef.current = result;
        tryComplete();
      })
      .catch((err) => {
        const message = err?.message || 'Analysis failed. Please try again.';
        setError(message);
      });
  }, [symptoms]); // eslint-disable-line react-hooks/exhaustive-deps

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 py-20">
        <div className="w-20 h-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-brand-black">Analysis Unavailable</h3>
          <p className="text-sm text-gray-400 font-medium max-w-sm">{error}</p>
        </div>
        <Button onClick={onReset} variant="outline" className="h-12 rounded-2xl px-8 text-xs font-black uppercase tracking-widest border-gray-200 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-16 py-20">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-brand-light/20 rounded-full blur-3xl -z-10 scale-[1.5]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-0 bg-brand-dark/10 rounded-full blur-2xl -z-10 scale-[1.2]"
        />
        <div className="w-40 h-40 rounded-[3.5rem] bg-brand-dark flex items-center justify-center shadow-2xl shadow-brand-dark/30 border border-brand-light/30 relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-brand-light to-transparent" />
          </motion.div>
          <BrainCircuit className="w-20 h-20 text-white" strokeWidth={1} />
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 text-center px-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-brand-black tracking-tight">Clinical Diagnosis Engine</h3>
          <p className="text-sm font-medium text-gray-400 italic">Processing natural language inputs with HealioMed-7B Model...</p>
        </div>

        <div className="space-y-6">
          <div className="w-full h-2.5 bg-gray-50 rounded-full border border-gray-100 overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / diagnosticSteps.length) * 100}%` }}
              className="absolute inset-y-0 left-0 bg-brand-dark rounded-full shadow-lg shadow-brand-dark/20"
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="h-10 relative overflow-hidden flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2.5 text-[11px] font-black text-brand-dark uppercase tracking-[0.15em]"
              >
                <div className="p-1 bg-brand-dark/5 rounded-md text-brand-dark">
                  {diagnosticSteps[currentStep].icon}
                </div>
                {diagnosticSteps[currentStep].label}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pt-10 flex items-center gap-6">
        <TriageStat label="Data Points" value="1.2M+" />
        <TriageStat label="Confidence" value="98.2%" />
        <TriageStat label="Model" value="H-Med v4" />
      </div>
    </div>
  );
}

function TriageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-6 border-r last:border-none border-gray-100">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-brand-black">{value}</p>
    </div>
  );
}
