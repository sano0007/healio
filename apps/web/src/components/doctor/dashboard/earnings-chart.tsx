"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const data = [
  { day: "Mon", amount: 1200, label: "$1.2k" },
  { day: "Tue", amount: 800, label: "$800" },
  { day: "Wed", amount: 1500, label: "$1.5k" },
  { day: "Thu", amount: 2100, label: "$2.1k" },
  { day: "Fri", amount: 1100, label: "$1.1k" },
  { day: "Sat", amount: 900, label: "$900" },
  { day: "Sun", amount: 800, label: "$800" },
];

const maxAmount = Math.max(...data.map(d => d.amount));

export function EarningsChart() {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm flex flex-col h-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <DollarSign className="w-5 h-5" />
             </div>
             <h3 className="text-xl font-bold text-brand-black tracking-tight">Weekly Revenue</h3>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-5">Mar 30 - Apr 06, 2026</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
           <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+12.5%</span>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-4 pt-10 pb-4 px-2">
        {data.map((d, i) => {
          const height = (d.amount / maxAmount) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
               <div className="relative w-full flex flex-col justify-end h-[160px]">
                  {/* Bar Value Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-75 group-hover:scale-100">
                     <div className="px-3 py-1.5 bg-brand-dark text-[10px] font-black text-white rounded-lg shadow-xl uppercase tracking-widest border border-white/10 backdrop-blur-xl">
                        {d.label}
                     </div>
                     <div className="w-2 h-2 bg-brand-dark rotate-45 mx-auto -mt-1 border-r border-b border-white/10" />
                  </div>

                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                    style={{ height: `${height}%` }}
                    className={cn(
                      "w-3/4 mx-auto rounded-xl transition-all duration-500 relative overflow-hidden",
                      d.day === "Thu" ? "bg-brand-dark shadow-xl shadow-brand-dark/20" : "bg-gray-100 group-hover:bg-brand-light"
                    )}
                  >
                     {/* Overlay Shine Effect */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.day}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
         <div className="space-y-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Payouts Status</p>
            <p className="text-[11px] font-bold text-brand-black flex items-center gap-2">
               <Calendar className="w-3.5 h-3.5 text-brand-light" />
               Next Payout: Friday, Apr 10
            </p>
         </div>
         <Button variant="outline" className="h-10 rounded-xl text-[9px] font-black uppercase tracking-widest border-gray-100 gap-2">
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
         </Button>
      </div>
    </div>
  );
}
