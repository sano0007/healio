"use client";

import {Calendar, Clock, FileText, MoreVertical, RefreshCcw, Star, User, Video, XCircle} from "lucide-react";
import {Avatar} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "confirmed" | "pending" | "completed" | "cancelled" | "awaiting_payment";
  fee: number;
}

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100" },
  awaiting_payment: {label: "Awaiting Payment", color: "bg-orange-50 text-orange-600 border-orange-100"},
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-600 border-blue-100" },
  cancelled: {label: "Cancelled", color: "bg-rose-50 text-rose-600 border-rose-100"},
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const config = statusConfig[appointment.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        {/* 1. Doctor Info */}
        <div className="flex items-center gap-4 shrink-0">
          <Avatar src={appointment.doctorImage} className="w-16 h-16 md:w-20 md:h-20 border-2 border-white shadow-sm" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-brand-black truncate max-w-[120px] md:max-w-full">{appointment.doctorName}</h3>
              <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border", config.color)}>
                {config.label}
              </div>
            </div>
            <p className="text-[11px] font-bold text-brand-dark opacity-70 uppercase tracking-widest">{appointment.doctorSpecialty}</p>
          </div>
        </div>

        {/* 2. Schedule & Consultation Type */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark transition-colors group-hover:bg-brand-light/10">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Date</div>
              <div className="text-sm font-bold text-brand-black">{appointment.date}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark transition-colors group-hover:bg-brand-light/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Time Slot</div>
              <div className="text-sm font-bold text-brand-black">{appointment.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark transition-colors group-hover:bg-brand-light/10">
              {appointment.type === "video" ? <Video className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Consultation</div>
              <div className="text-sm font-bold text-brand-black">
                {appointment.type === "video" ? "Video Call" : "In-Person Visit"}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center gap-3 md:pl-6 md:border-l border-gray-50">
          {appointment.status === "confirmed" && (
            <>
              {appointment.type === "video" ? (
                <Button variant="dark" className="rounded-xl px-6 h-12 text-xs font-bold gap-2 shadow-lg shadow-brand-dark/10 hover:scale-[1.02] active:scale-95 transition-all">
                  Join Meeting
                  <Video className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="outline" className="rounded-xl px-6 h-12 text-xs font-bold gap-2 border-brand-light/20 hover:bg-brand-light/5">
                  View Map
                  <MoreVertical className="w-4 h-4" />
                </Button>
              )}
            </>
          )}

          {appointment.status === "completed" && (
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl h-12 px-4 text-xs font-bold gap-2 border-brand-light/20">
                <FileText className="w-4 h-4" />
                Prescription
              </Button>
              <Button variant="outline" className="rounded-xl h-12 px-4 text-xs font-bold gap-2 border-brand-light/20">
                <Star className="w-4 h-4" />
                Review
              </Button>
            </div>
          )}

          {appointment.status === "cancelled" && (
            <Button variant="dark" className="rounded-xl h-12 px-6 text-xs font-bold gap-2 shadow-lg shadow-brand-dark/10">
              Rebook Appointment
            </Button>
          )}

          {appointment.status === "confirmed" && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100">
                <XCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-gray-400 hover:text-brand-dark hover:bg-brand-light/10 border border-transparent hover:border-brand-light/20">
                <RefreshCcw className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative pulse for live items */}
      {appointment.status === "confirmed" && appointment.type === "video" && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full animate-pulse">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Live Now</span>
        </div>
      )}
    </motion.div>
  );
}
