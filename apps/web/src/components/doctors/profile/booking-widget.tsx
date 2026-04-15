"use client";

import { Video, User, Calendar as CalendarIcon, Clock, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

const timeSlots = {
  morning: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  afternoon: ["01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"],
  evening: ["06:00 PM", "06:30 PM", "07:00 PM"],
};

const next7Days = [...Array(7)].map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate(),
    full: date,
  };
});

export function BookingWidget({ fee, doctorId }: { fee: number; doctorId?: string }) {
  const [type, setType] = useState<"in-person" | "video">("video");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-brand-dark/5 sticky top-24 self-start">
      <h2 className="text-xl font-bold text-brand-black mb-6">Book Appointment</h2>

      {/* 1. Consultation Type */}
      <div className="flex p-1.5 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
        <button
          onClick={() => setType("video")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
            type === "video" ? "bg-white shadow-sm text-brand-dark border border-brand-light/10" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <Video className="w-4 h-4" />
          Video Call
        </button>
        <button
          onClick={() => setType("in-person")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
            type === "in-person" ? "bg-white shadow-sm text-brand-dark border border-brand-light/10" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <User className="w-4 h-4" />
          In-Person
        </button>
      </div>

      {/* 2. Horizontal Calendar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-brand-black">Select Date</h3>
          <span className="text-[11px] font-bold text-brand-dark hover:underline cursor-pointer uppercase tracking-tight">July 2026</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {next7Days.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(i)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] h-[72px] rounded-2xl border-2 transition-all",
                selectedDate === i 
                  ? "bg-brand-dark border-brand-dark text-white shadow-lg shadow-brand-dark/20" 
                  : "bg-white border-gray-50 text-gray-500 hover:border-brand-light/30"
              )}
            >
              <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.day}</span>
              <span className="text-sm font-bold">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Time Slots */}
      <div className="mb-10 space-y-6">
        {Object.entries(timeSlots).map(([key, slots]) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
              <Clock className="w-3 h-3" />
              {key}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={cn(
                    "py-2.5 rounded-xl text-[11px] font-bold border transition-all",
                    selectedTime === slot 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-brand-light/30 hover:text-brand-dark"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Pricing & Final CTA */}
      <div className="pt-6 border-t border-gray-50 space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="text-sm text-gray-500 font-medium">Consultation Fee</div>
          <div className="text-xl font-bold text-brand-black">${fee}</div>
        </div>

        <Button variant="dark" className="w-full h-14 rounded-2xl text-sm font-bold gap-2 shadow-xl shadow-brand-dark/10 hover:scale-[1.02] active:scale-95 transition-all">
          Book Appointment
          <ChevronRight className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium px-2 py-3 bg-gray-50/50 rounded-xl">
          <Info className="w-3 h-3 text-brand-dark opacity-60" />
          No cancellation fee up to 24 hours prior.
        </div>
      </div>
    </div>
  );
}
