"use client";

import { Star, Clock, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

export interface Doctor {
  _id: string;
  userId: string;
  name: string;
  email: string;
  specialty?: string;
  qualifications?: string[];
  experience?: number;
  bio?: string;
  consultationFee?: number;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  availability?: { dayOfWeek: number; startTime: string; endTime: string }[];
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const experience = doctor.experience || 0;
  const rating = doctor.rating || 0;
  const reviewCount = doctor.reviewCount || 0;
  const fee = doctor.consultationFee || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 transition-all hover:border-brand-light/30 hover:shadow-xl hover:shadow-brand-dark/5"
    >
      <div className="flex items-start gap-5">
        <div className="relative">
          <Avatar src="/images/doctor-1.png" className="w-20 h-20 lg:w-24 lg:h-24 border-2 border-brand-light/10" />
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
              <span className="text-[10px] font-black text-amber-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium mb-2 truncate">
            {doctor.specialty || "General Physician"}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{experience}+ years</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>{reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Consultation Fee</span>
          <span className="font-bold text-brand-dark text-lg">${fee}</span>
        </div>
        <Link href={`/doctors/${doctor.userId || doctor._id}`}>
          <Button variant="ghost" size="sm" className="group/btn">
            View Profile
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <Badge variant="secondary" className="absolute top-4 right-4">
        {doctor.isVerified ? "Verified" : "Pending"}
      </Badge>
    </motion.div>
  );
}