'use client';

import { Users, GraduationCap, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export interface DoctorStatsGridProps {
  patients: string;
  experience: number;
  rating: number;
  reviews: number;
}

export function DoctorStatsGrid({
  patients,
  experience,
  rating,
  reviews,
}: DoctorStatsGridProps) {
  const stats = [
    {
      label: 'Patients',
      value: patients,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Experience',
      value: `${experience}+ Yrs`,
      icon: GraduationCap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Rating',
      value: rating,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Reviews',
      value: reviews,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:border-brand-light/30 transition-all hover:shadow-md"
        >
          <div
            className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
          >
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="text-xl font-bold text-brand-black">{stat.value}</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
