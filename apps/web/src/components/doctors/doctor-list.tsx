'use client';

import { motion } from 'framer-motion';
import { DoctorCard, type Doctor } from './doctor-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Stethoscope } from 'lucide-react';

export function DoctorList({
  doctors = [],
  isLoading = false,
  error,
}: {
  doctors?: Doctor[];
  isLoading?: boolean;
  error?: Error | null;
}) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[280px] bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-1/4 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Stethoscope className="w-10 h-10 text-red-300" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">
          Failed to load doctors
        </h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          We couldn't load the doctors. Please check your connection and try
          again.
        </p>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
          <Stethoscope className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">
          No doctors found
        </h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          We couldn't find any specialist matching your criteria. Try adjusting
          your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor._id} doctor={doctor} />
      ))}
    </div>
  );
}
