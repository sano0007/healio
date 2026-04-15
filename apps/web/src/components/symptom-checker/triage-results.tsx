"use client";

import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, UserCircle, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockResults = {
  severity: "Moderate", // Low, Moderate, High, Emergency
  conditions: [
    { name: "Tension Headache", probability: 82, description: "A common type of headache caused by stress, fatigue, or muscle tension.", specialist: "General Physician" },
    { name: "Dehydration", probability: 64, description: "Insufficient fluid intake leading to fatigue and cognitive fog.", specialist: "General Physician" },
    { name: "Ocular Migraine", probability: 41, description: "Temporary visual disturbances followed by persistent throbbing pain.", specialist: "Neurologist" },
  ],
  recommendedActions: [
    "Increase fluid intake immediately.",
    "Rest in a quiet, dark room for 30 minutes.",
    "Monitor temperature for next 12 hours.",
  ]
};

export function TriageResults({ onReset }: { onReset: () => void }) {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Emergency": return "bg-rose-50 border-rose-100 text-rose-600";
      case "High": return "bg-orange-50 border-orange-100 text-orange-600";
      case "Moderate": return "bg-amber-50 border-amber-100 text-amber-600";
      default: return "bg-emerald-50 border-emerald-100 text-emerald-600";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* 1. Severity Banner */}
      <div className={cn("p-8 rounded-[3rem] border flex items-center justify-between gap-8 relative overflow-hidden", getSeverityStyle(mockResults.severity))}>
         <div className="space-y-2 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Triage Severity Assessment</p>
            <h2 className="text-3xl font-black tracking-tight">{mockResults.severity} Risk Level</h2>
         </div>
         <div className="relative z-10 px-6 py-2 bg-white/40 rounded-2xl border border-white/60 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md">
            Follow Actions Below
         </div>
         <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-current opacity-10 blur-3xl"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 2. Potential Conditions (Main Column) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                 Potential Diagnostic Correlations
              </h3>
              <p className="text-[10px] font-bold text-brand-dark italic">Confidence Rank</p>
           </div>
           
           <div className="space-y-4">
              {mockResults.conditions.map((condition, i) => (
                <motion.div
                  key={condition.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-brand-light/30 hover:shadow-xl transition-all group"
                >
                   <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                         <h4 className="text-lg font-bold text-brand-black">{condition.name}</h4>
                         <p className="text-xs text-gray-400 leading-relaxed font-medium">{condition.description}</p>
                      </div>
                      <div className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                         <span className="text-sm font-black text-brand-dark">{condition.probability}%</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-brand-light/10 rounded-xl text-brand-dark">
                            <UserCircle className="w-4 h-4" />
                         </div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest underline decoration-brand-light underline-offset-4">
                            Recommended Specialist: <span className="text-brand-black">{condition.specialist}</span>
                         </p>
                      </div>
                      <Link href={`/doctors?specialty=${condition.specialist}`} className="text-[10px] font-black text-brand-dark uppercase tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all">
                        Find Specialists
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* 3. Action Summary & Sidebar */}
        <div className="space-y-8">
           <div className="bg-brand-black p-8 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                 <h3 className="text-lg font-black tracking-tight">Clinical Guidance</h3>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Immediate Next Steps</p>
              </div>

              <div className="space-y-6 relative z-10">
                 {mockResults.recommendedActions.map((action, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">
                         0{i + 1}
                      </div>
                      <p className="text-xs font-medium text-gray-300 leading-relaxed italic">{action}</p>
                   </div>
                 ))}
              </div>

              <Button variant="outline" className="w-full h-12 rounded-2xl bg-white/10 border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-black relative z-10 transition-colors">
                 Download Full Report
              </Button>

              <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-brand-light/10 blur-3xl" />
           </div>

           <div className="p-8 rounded-[3rem] border border-gray-100 bg-gray-50 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand-dark shadow-sm">
                 <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <p className="text-lg font-bold text-brand-black tracking-tight">Need a Clinical Consultation?</p>
                 <p className="text-xs text-gray-400 font-medium">Book a 15-min virtual triage with a certified physician now.</p>
              </div>
              <Button onClick={onReset} variant="outline" className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest border-gray-100 hover:border-brand-light/30">
                 Reset Analysis
              </Button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
