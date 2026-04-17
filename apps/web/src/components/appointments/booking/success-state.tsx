'use client';

import {
  CheckCircle2,
  Calendar,
  LayoutDashboard,
  Copy,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function SuccessState({
  appointmentId,
  date,
  time,
}: {
  appointmentId: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
      {/* 1. Animated Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 mb-8"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>

      {/* 2. Success Messages */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-12"
      >
        <h1 className="text-4xl font-bold text-brand-black tracking-tight underline underline-offset-8 decoration-emerald-100 decoration-4">
          Booking Success!
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          Your appointment has been confirmed. You will receive a notification
          and an email shortly.
        </p>
      </motion.div>

      {/* 3. Appointment Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-brand-dark/5 mb-12 relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16" />

        <div className="grid sm:grid-cols-2 gap-8 relative z-10">
          <div className="text-left space-y-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
              Appointment ID
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="text-sm font-bold text-brand-black">
                {appointmentId}
              </span>
              <Copy className="w-3.5 h-3.5 text-brand-dark/30 group-hover:text-brand-dark transition-colors" />
            </div>
          </div>
          <div className="text-left space-y-1 sm:text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
              Schedule
            </div>
            <div className="text-sm font-bold text-brand-black leading-none">
              {date}
            </div>
            <div className="text-[12px] font-bold text-emerald-600 mt-1">
              {time}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap gap-4 justify-center">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-bold gap-2 border-brand-light/10 hover:bg-brand-light/5"
          >
            <Calendar className="w-4 h-4 text-brand-dark" />
            Add to Google Calendar
          </Button>
          <Button
            variant="outline"
            className="rounded-xl text-xs font-bold gap-2 border-brand-light/10 hover:bg-brand-light/5"
          >
            <Share2 className="w-4 h-4 text-brand-dark" />
            Share with Family
          </Button>
        </div>
      </motion.div>

      {/* 4. Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 w-full"
      >
        <Link href="/dashboard" className="flex-1">
          <Button
            variant="dark"
            className="w-full h-14 rounded-2xl text-sm font-bold gap-2 shadow-xl shadow-brand-dark/10"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/appointments" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl text-sm font-bold gap-2 border-brand-light/20 hover:bg-brand-light/5"
          >
            View My Appointments
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
