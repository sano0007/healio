'use client';

import { Star, MapPin, CheckCircle2, Share2, Heart } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface DoctorProfileHeaderProps {
  name: string;
  specialization: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  isVerified?: boolean;
}

export function DoctorProfileHeader({
  name,
  specialization,
  image,
  rating,
  reviews,
  location,
  isVerified = true,
}: DoctorProfileHeaderProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm overflow-hidden relative group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-brand-light/20" />

      <div className="flex flex-col md:flex-row gap-8 md:items-center relative z-10">
        {/* Profile Image & Verification */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl shadow-brand-dark/5 overflow-hidden">
            <Avatar src={image} className="w-full h-full object-cover" />
          </div>
          {isVerified && (
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-lg border border-gray-50">
              <CheckCircle2
                className="w-6 h-6 text-brand-dark"
                fill="currentColor"
              />
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-black tracking-tight mb-1">
                {name}
              </h1>
              <p className="text-lg font-bold text-brand-dark tracking-wide uppercase text-[12px] opacity-80">
                {specialization}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl w-11 h-11 border-brand-light/20 hover:bg-brand-light/10"
              >
                <Share2 className="w-5 h-5 text-brand-dark" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl w-11 h-11 border-brand-light/20 hover:bg-brand-light/10"
              >
                <Heart className="w-5 h-5 text-brand-dark" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Rating */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-amber-700">{rating}</span>
              <span className="text-amber-700/60 font-medium">
                ({reviews} Reviews)
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-light" />
              </div>
              {location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
