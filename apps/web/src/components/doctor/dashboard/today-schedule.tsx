"use client";

import { motion } from "framer-motion";
import { User, Clock, Phone, Video, MoreHorizontal, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schedule = [
  {
    id: 1,
    time: "09:00 AM",
    patientName: "Robert Fox",
    reason: "Post-surgery follow-up",
    age: 45,
    gender: "Male",
    status: "Confirmed",
    urgency: "Normal",
    avatar: "/images/doctor-1.png",
  },
  {
    id: 2,
    time: "10:30 AM",
    patientName: "Jenny Wilson",
    reason: "Severe abdominal pain",
    age: 28,
    gender: "Female",
    status: "Waiting",
    urgency: "High",
    avatar: "/images/doctor-2.png",
  },
  {
    id: 3,
    time: "11:45 AM",
    patientName: "Devon Lane",
    reason: "Prescription refill",
    age: 62,
    gender: "Male",
    status: "Consulting",
    urgency: "Low",
    avatar: "/images/doctor-3.png",
  },
  {
    id: 4,
    time: "02:15 PM",
    patientName: "Leslie Alexander",
    reason: "Annual physical exam",
    age: 35,
    gender: "Female",
    status: "Upcoming",
    urgency: "Normal",
    avatar: "/images/doctor-4.png",
  },
];

export function TodaySchedule() {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 lg:p-12 shadow-sm space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <h2 className="text-2xl font-bold text-brand-black">Today's Schedule</h2>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-5">4 Patients left for the day</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest border-gray-100 italic">
            Full Agenda
          </Button>
          <Button variant="dark" className="h-10 bg-brand-light text-brand-dark hover:bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-dark/5">
            Add Slot
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Path */}
        <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dashed" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, #F3F4F6 50%)', backgroundSize: '1px 12px' }} />

        <div className="space-y-12">
          {schedule.map((session, index) => (
            <motion.div 
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-10 group"
            >
              {/* Timeline Node */}
              <div className="pt-2">
                <div className={cn(
                  "w-[80px] h-[34px] rounded-full flex items-center justify-center text-[10px] font-black tracking-widest transition-all shadow-sm border",
                  session.status === "Consulting" 
                    ? "bg-brand-dark text-white border-transparent scale-110 shadow-xl shadow-brand-dark/20" 
                    : "bg-white text-gray-400 border-gray-100 group-hover:border-brand-light"
                )}>
                  {session.time}
                </div>
              </div>

              {/* Appointment Card */}
              <div className={cn(
                "flex-1 p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-8",
                session.status === "Consulting"
                  ? "bg-brand-light/10 border-brand-light shadow-lg shadow-brand-light/5"
                  : "bg-white border-gray-50 hover:border-brand-light group-hover:shadow-2xl group-hover:shadow-brand-dark/5"
              )}>
                {/* Patient Profile */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-4 ring-gray-50">
                      <img src={session.avatar} alt={session.patientName} className="w-full h-full object-cover" />
                    </div>
                    {session.urgency === "High" && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-base font-bold text-brand-black">{session.patientName}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{session.age}y • {session.gender}</p>
                  </div>
                </div>

                {/* Reason & Status */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full",
                      session.status === "Consulting" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {session.status}
                    </span>
                    {session.urgency === "High" && (
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-red-50 text-red-500 italic underline decoration-red-200">
                        Urgent Action
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-brand-black/70 italic leading-relaxed">
                    "{session.reason}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-gray-100 group-hover:bg-brand-light/5">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button 
                    variant={session.status === "Consulting" ? "dark" : "outline"} 
                    className={cn(
                      "h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-3 transition-all",
                      session.status === "Consulting" 
                        ? "bg-brand-dark text-white shadow-xl shadow-brand-dark/20 pulse" 
                        : "border-gray-100 hover:bg-brand-light hover:text-brand-dark"
                    )}
                  >
                    <Video className="w-4 h-4" />
                    {session.status === "Consulting" ? "Resume Session" : "Start Call"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
