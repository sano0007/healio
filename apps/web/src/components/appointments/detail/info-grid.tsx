"use client";

import { User, Calendar, Clock, MapPin, CreditCard, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface InfoGridProps {
  doctor: any;
  patient: any;
  schedule: any;
  billing: any;
}

export function InfoGrid({ doctor, patient, schedule, billing }: InfoGridProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* 1. Primary Info Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Doctor & Patient Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <DetailCard icon={<User />} title="Consultation with">
            <div className="flex items-center gap-4 mt-4">
              <Avatar src={doctor.image} className="w-12 h-12 border-2 border-white shadow-sm" />
              <div>
                <p className="text-sm font-bold text-brand-black leading-none mb-1">{doctor.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{doctor.specialty}</p>
              </div>
            </div>
          </DetailCard>

          <DetailCard icon={<User />} title="Patient Details">
            <div className="mt-4">
              <p className="text-sm font-bold text-brand-black leading-none mb-1">{patient.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{patient.relationship || "Self"}</p>
            </div>
          </DetailCard>
        </div>

        {/* Schedule & Meeting Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <DetailCard icon={<Calendar />} title="Schedule">
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Date</span>
                <span className="text-sm font-bold text-brand-black">{schedule.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Time</span>
                <span className="text-sm font-bold text-brand-black">{schedule.time}</span>
              </div>
              <div className="flex items-center justify-between text-brand-dark/60">
                <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">30 Minutes</span>
              </div>
            </div>
          </DetailCard>

          <DetailCard icon={schedule.type === "video" ? <Calendar /> : <MapPin />} title="Consultation Link">
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-brand-light/30 transition-all">
              <div className="flex flex-col gap-0.5 max-w-[180px]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Session URL</span>
                <span className="text-xs font-medium text-brand-black truncate">zoom.us/j/98231?pwd=Healio_2026</span>
              </div>
              <Copy className="w-4 h-4 text-brand-dark/20 group-hover:text-brand-dark transition-all" />
            </div>
          </DetailCard>
        </div>
      </div>

      {/* 2. Billing Sidebar Column */}
      <div className="space-y-6">
        <DetailCard icon={<CreditCard />} title="Billing Summary">
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-400">Consultation Fee</span>
              <span className="font-bold text-brand-black">${billing.fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-400">Booking Service Fee</span>
              <span className="font-bold text-brand-black">${billing.tax.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-black">Total Amount Paid</span>
              <span className="text-lg font-bold text-brand-black">${(billing.fee + billing.tax).toFixed(2)}</span>
            </div>
            
            <div className="mt-6 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-black leading-none mb-1">Payment Successful</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Via Mastercard x-4242</p>
              </div>
            </div>
          </div>
        </DetailCard>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, children }: { icon: any; title: string; children: any }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md h-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-light/10 flex items-center justify-center text-brand-dark transition-colors">
          {icon}
        </div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}
