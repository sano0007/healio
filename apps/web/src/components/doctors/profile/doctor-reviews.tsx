"use client";

import { Star, CheckCircle2, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Link from "next/link";

export interface Review {
  id: string;
  patientName: string;
  patientImage: string;
  rating: number;
  date: string;
  comment: string;
  isVerified?: boolean;
}

export function DoctorReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-brand-black">Patient Reviews</h2>
        <Link href="#" className="text-sm font-bold text-brand-dark hover:underline flex items-center gap-1 group">
          View all {reviews.length} reviews <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-gray-50/50 border border-transparent hover:border-brand-light/20 hover:bg-white transition-all group"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Avatar src={review.patientImage} className="w-12 h-12 border-2 border-white shadow-sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-brand-black">{review.patientName}</h4>
                    {review.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 opacity-80" fill="currentColor" />}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 rounded-xl">
                <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                <span className="text-xs font-bold text-amber-700">{review.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
              "{review.comment}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
