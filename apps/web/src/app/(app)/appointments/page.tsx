"use client";

import { useState, useEffect } from "react";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockAppointments = [
  {
    id: "1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Senior Cardiologist",
    doctorImage: "/images/doctor-1.png",
    date: "Tuesday, July 7, 2026",
    time: "09:30 AM",
    type: "video" as const,
    status: "confirmed" as const,
    fee: 150,
  },
  {
    id: "2",
    doctorId: "d2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Dermatologist",
    doctorImage: "/images/doctor-2.png",
    date: "Wednesday, July 8, 2026",
    time: "02:15 PM",
    type: "in-person" as const,
    status: "confirmed" as const,
    fee: 120,
  },
  {
    id: "3",
    doctorId: "d3",
    doctorName: "Dr. Emily Wilson",
    doctorSpecialty: "General Physician",
    doctorImage: "/images/doctor-3.png",
    date: "Monday, June 30, 2026",
    time: "10:00 AM",
    type: "video" as const,
    status: "completed" as const,
    fee: 100,
  },
  {
    id: "4",
    doctorId: "d4",
    doctorName: "Dr. James Brown",
    doctorSpecialty: "Pediatrician",
    doctorImage: "/images/doctor-4.png",
    date: "Friday, June 26, 2026",
    time: "04:30 PM",
    type: "video" as const,
    status: "canceled" as const,
    fee: 130,
  }
];

export default function AppointmentsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-10 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
          <Skeleton className="h-10 w-96 rounded-2xl" />
          <Skeleton className="h-12 w-80 rounded-2xl" />
        </div>
        <div className="grid gap-6 px-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4">
      {/* 1. Header & Navigation */}
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            <Link href="/dashboard" className="hover:text-brand-dark transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-dark">My Appointments</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-black tracking-tight">Schedule & History</h1>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">2 Upcoming Sessions</span>
        </div>
      </div>

      {/* 2. Main List Filter & Results */}
      <AppointmentList initialAppointments={mockAppointments} />

      {/* 3. Helper Note */}
      <div className="mt-20 p-8 bg-brand-light/5 rounded-[2.5rem] border border-brand-light/10 flex flex-col md:flex-row gap-8 items-center text-center md:text-left transition-all hover:bg-brand-light/10">
        <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-brand-dark shadow-sm shrink-0 border border-brand-light/10">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-brand-black flex items-center gap-2 justify-center md:justify-start">
            Need to schedule a new consultation?
            <Info className="w-4 h-4 text-brand-dark opacity-60" />
          </h3>
          <p className="text-sm text-gray-500 font-medium">Browse our expert doctors by specialty, rating, or availability and book in just 3 steps.</p>
        </div>
        <Link href="/doctors">
          <Button variant="dark" className="h-14 px-10 rounded-2xl text-sm font-bold gap-2 shadow-xl shadow-brand-dark/10 group">
            Find a Specialist
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Minimal arrow icon helper
function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
