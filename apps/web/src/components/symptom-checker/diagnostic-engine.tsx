"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, ShieldCheck, Database, Search, FileText } from "lucide-react";
import { useEffect, useState } from "react";

const diagnosticSteps = [
  { icon: <Database />, label: "Accessing Global Clinical Databases..." },
  { icon: <Search />, label: "Identifying Symptomatic Correlations..." },
  { icon: <BrainCircuit />, label: "Applying Neural Diagnostic Models..." },
  { icon: <Activity />, label: "Calculating Condition Probability..." },
  { icon: <FileText />, label: "Finalizing Clinical Triage Summary..." },
];

export function DiagnosticEngine({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= diagnosticSteps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-16 py-20">
      <div className="relative">
        {/* Pulsing Rings */}
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

        {/* Central Engine Icon */}
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

        {/* Progress System */}
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
