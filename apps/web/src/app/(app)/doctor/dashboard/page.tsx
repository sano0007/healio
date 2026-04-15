"use client";

import { WelcomeBanner } from "@/components/doctor/dashboard/welcome-banner";
import { StatGrid } from "@/components/doctor/dashboard/stat-grid";
import { TodaySchedule } from "@/components/doctor/dashboard/today-schedule";
import { PendingRequests } from "@/components/doctor/dashboard/pending-requests";
import { EarningsChart } from "@/components/doctor/dashboard/earnings-chart";
import { motion } from "framer-motion";
import { Plus, Search, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorDashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-12">
      {/* 1. Welcome Header Section */}
      <WelcomeBanner />

      {/* 2. Global Clinician Statistics */}
      <StatGrid />

      {/* 3. Operational Grid (Schedule + Management) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         {/* Main Activity Column (2/3) */}
         <div className="xl:col-span-2 space-y-12">
            <TodaySchedule />
         </div>

         {/* Side Control Column (1/3) */}
         <div className="space-y-12">
            <PendingRequests />
            <EarningsChart />
         </div>
      </div>

      {/* 4. Help & Support Footer (Clinical Focus) */}
      <div className="pt-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity pb-20">
         <div className="flex items-center gap-6">
            <p className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] border-r border-gray-200 pr-6">Healio Clinician Hub v4.8</p>
            <p className="text-[10px] font-medium text-gray-400 italic">24/7 Clinical Support • Priority Medical Infrastructure • AES-256 Secured</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Safety Protocols</button>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Regulatory Help</button>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Emergency Center</button>
         </div>
      </div>

      {/* Floating Action Bar (Clinical Shortcut) */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-brand-dark rounded-full p-2 px-6 shadow-2xl border border-white/10 backdrop-blur-xl flex items-center gap-6"
      >
         <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-2 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Clinician Active</span>
         </div>
         <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-10 text-white/60 hover:text-white hover:bg-white/5 rounded-full px-4 text-[9px] font-black uppercase tracking-widest gap-2">
               <Search className="w-4 h-4" />
               Clinical Search
            </Button>
            <Button variant="ghost" className="h-10 text-white/60 hover:text-white hover:bg-white/5 rounded-full px-4 text-[9px] font-black uppercase tracking-widest gap-2">
               <Calendar className="w-4 h-4" />
               Availability
            </Button>
            <Button className="h-10 bg-brand-light text-brand-dark hover:bg-white rounded-full px-6 text-[9px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-brand-dark/20">
               <Plus className="w-4 h-4" />
               New Consultation
            </Button>
         </div>
      </motion.div>
    </div>
  );
}
