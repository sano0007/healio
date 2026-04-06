"use client";

import { Star, Clock, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  nextAvailable: string;
  isVerified?: boolean;
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 transition-all hover:border-brand-light/30 hover:shadow-xl hover:shadow-brand-dark/5"
    >
      <div className="flex items-start gap-5">
        <div className="relative">
          <Avatar src={doctor.image} className="w-20 h-20 lg:w-24 lg:h-24 border-2 border-brand-light/10" />
          {doctor.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-brand-dark" fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-base font-black text-brand-black truncate group-hover:text-brand-dark transition-colors leading-tight">
              {doctor.name}
            </h3>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-lg border border-amber-100 shrink-0">
              <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
              <span className="text-[10px] font-black text-amber-700">{doctor.rating}</span>
            </div>
          </div>
          
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">{doctor.specialization}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-brand-light" />
              {doctor.experience} yrs exp.
            </div>
            <div className="w-px h-3 bg-gray-100 mx-1" />
            <div className="flex items-center gap-1 text-[10px] text-brand-dark font-black bg-brand-light/20 px-2 py-0.5 rounded-md">
              ${doctor.fee} <span className="font-bold text-brand-dark/40 ml-0.5">/ session</span>
            </div>
          </div>

          <div className="flex items-center gap-2 py-3 border-t border-gray-50 mt-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
               <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
               <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.15em] leading-none mb-1">Next Available</span>
               <span className="text-[10px] font-black text-emerald-600 truncate">{doctor.nextAvailable}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button variant={"dark"} className="flex-1 rounded-xl h-11 text-xs font-bold gap-2 shadow-lg shadow-brand-dark/10">
          Book Appointment
        </Button>
        <Link 
          href={`/doctors/${doctor.id}`}
          className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-100 text-gray-400 hover:text-brand-dark hover:bg-white hover:border-gray-200 transition-all group/btn"
        >
          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
