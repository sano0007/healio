"use client";

import {Calendar, Clock, Info, User, Video} from "lucide-react";
import {Avatar} from "@/components/ui/avatar";

export interface BookingSummaryProps {
  doctor: {
    name: string;
    specialization: string;
    image: string;
    fee: number;
  };
  details: {
    date: string;
    time: string;
    type: "video" | "in-person";
    location?: string;
  };
}

export function BookingSummarySidebar({ doctor, details }: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-brand-dark/5 sticky top-24 self-start">
      <h2 className="text-xl font-bold text-brand-black mb-8 px-1">Booking Summary</h2>

      {/* 1. Doctor Info */}
      <div className="flex items-center gap-4 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
          <Avatar src={doctor.image || "/images/doctor-1.png"} className="w-16 h-16 border-2 border-white shadow-sm"/>
        <div>
          <h3 className="text-sm font-bold text-brand-black leading-none mb-1">{doctor.name}</h3>
          <p className="text-[11px] font-bold text-brand-dark opacity-70 uppercase tracking-widest">{doctor.specialization}</p>
        </div>
      </div>

      {/* 2. Schedule Details */}
      <div className="space-y-6 mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</div>
            <div className="text-sm font-bold text-brand-black">{details.date}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Slot</div>
            <div className="text-sm font-bold text-brand-black">{details.time}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            {details.type === "video" ? <Video className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consultation</div>
            <div className="text-sm font-bold text-brand-black">
              {details.type === "video" ? "Video Consultation" : "In-Person Visit"}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pricing Breakdown */}
      <div className="pt-8 border-t border-gray-50 space-y-4 px-1">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium tracking-tight">Consultation Fee</div>
          <div className="text-sm font-bold text-brand-black">${doctor.fee}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium tracking-tight">Booking Tax</div>
          <div className="text-sm font-bold text-brand-black">$5.00</div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="text-lg font-bold text-brand-black">Total Fee</div>
          <div className="text-xl font-bold text-brand-dark">${doctor.fee + 5}</div>
        </div>
      </div>

      {/* 4. Footer Note */}
      <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-400 font-medium px-2 py-3 bg-gray-50/50 rounded-xl">
        <Info className="w-3 h-3 text-brand-dark opacity-60" />
        Booking is secured by Healio Protection Platform.
      </div>
    </div>
  );
}
