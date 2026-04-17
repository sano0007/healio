'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Clock, Video } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppointments } from '@/hooks/use-appointments';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function UpcomingAppointments() {
  const { data: appointments, isLoading } = useAppointments();

  const upcoming = (appointments ?? [])
    .filter(
      (apt) =>
        apt.status === 'confirmed' ||
        apt.status === 'pending' ||
        apt.status === 'awaiting_payment',
    )
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-6 w-48 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-50 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">
            Upcoming Appointments
          </h2>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          No upcoming appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">
            Upcoming Appointments
          </h2>
        </div>
        <Link
          href="/appointments"
          className="text-sm font-semibold text-brand-dark hover:underline flex items-center gap-1 group"
        >
          View all{' '}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {upcoming.map((appt, idx) => (
          <motion.div
            key={appt._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-brand-dark/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <Avatar
                src={appt.doctor?.image || '/images/doctor-1.png'}
                className="w-14 h-14 border-2 border-brand-light/20"
              />
              <div>
                <h3 className="font-bold text-brand-black group-hover:text-brand-dark transition-colors">
                  {appt.doctor?.name || 'Doctor'}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {appt.doctor?.specialty || 'General Physician'} •{' '}
                  {appt.type || 'video'}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-dark/60" />
                    {formatDate(appt.scheduledAt)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-dark/60" />
                    {formatTime(appt.scheduledAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {appt.type === 'video' && appt.status === 'confirmed' && (
                <Link
                  href={`/consultations/${appt._id}`}
                  className="flex-1 sm:flex-none"
                >
                  <Button
                    variant="dark"
                    size="sm"
                    className="w-full rounded-xl h-10 text-xs font-bold gap-1.5 shadow-md shadow-brand-dark/10"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Join
                  </Button>
                </Link>
              )}
              <Link
                href={`/appointments/${appt._id}`}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl h-10 text-xs font-bold border-brand-light/20"
                >
                  View
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
