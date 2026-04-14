"use client";

import { motion } from "framer-motion";
import { UserPlus, CheckCircle2, DollarSign, CalendarDays, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Today's Schedule",
    value: "12",
    subtext: "0 completed",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
    trend: "+2 from yesterday",
    active: true,
  },
  {
    label: "Pending Requests",
    value: "05",
    subtext: "Needs review",
    icon: UserPlus,
    color: "bg-brand-light/20 text-brand-dark",
    trend: "Priority: High",
    active: false,
  },
  {
    label: "Consultations",
    value: "142",
    subtext: "This month",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
    trend: "Target: 200",
    active: false,
  },
  {
    label: "Total Earnings",
    value: "$8.4k",
    subtext: "Gross revenue",
    icon: DollarSign,
    color: "bg-orange-50 text-orange-600",
    trend: "+12.5% vs last month",
    active: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatGrid() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div 
          key={i} 
          variants={item}
          className="group relative p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-brand-dark/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
        >
          {/* Subtle Progress Overlay for Revenue */}
          {stat.label === "Total Earnings" && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-50">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "72%" }}
                 transition={{ duration: 1.5, delay: 0.5 }}
                 className="h-full bg-orange-400"
               />
            </div>
          )}

          <div className="flex justify-between items-start relative z-10">
            <div className={cn("p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 mb-2">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.trend}</span>
               </div>
               <ArrowUpRight className="w-5 h-5 text-gray-200 group-hover:text-brand-dark transition-colors" />
            </div>
          </div>

          <div className="mt-8 space-y-1 relative z-10">
            <h3 className="text-4xl font-bold text-brand-black tracking-tighter">
              {stat.value}
            </h3>
            <div>
              <p className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <p className="text-[10px] font-medium text-gray-400 italic">
                {stat.subtext}
              </p>
            </div>
          </div>

          {/* Decorative Corner Element */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-brand-light/10 transition-colors" />
        </motion.div>
      ))}
    </motion.div>
  );
}
