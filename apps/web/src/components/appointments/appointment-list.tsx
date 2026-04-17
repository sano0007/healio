'use client';

import { useState } from 'react';
import { AppointmentTabs } from './appointment-tabs';
import { Appointment, AppointmentCard } from './appointment-card';
import { AppointmentEmptyState } from './appointment-empty-state';
import { AnimatePresence } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AppointmentWithDoctor } from '@/hooks/use-appointments';

interface AppointmentListProps {
  appointments: AppointmentWithDoctor[];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const transformedAppointments: Appointment[] = appointments.map((apt) => ({
    id: apt._id,
    doctorId: apt.doctorId,
    doctorName: apt.doctor?.name || 'Unknown Doctor',
    doctorSpecialty: apt.doctor?.specialty || 'General Physician',
    doctorImage: '/images/doctor-1.png',
    date: formatDate(apt.scheduledAt),
    time: formatTime(apt.scheduledAt),
    type: 'video' as const,
    status: apt.status as
      | 'confirmed'
      | 'completed'
      | 'cancelled'
      | 'awaiting_payment',
    fee: apt.doctor?.consultationFee || 0,
  }));

  const filteredAppointments = transformedAppointments.filter((app) => {
    const matchesTab =
      (activeTab === 'upcoming' &&
        (app.status === 'confirmed' ||
          app.status === 'pending' ||
          app.status === 'awaiting_payment')) ||
      (activeTab === 'completed' && app.status === 'completed') ||
      (activeTab === 'canceled' && app.status === 'cancelled');

    const matchesSearch =
      app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Filtering Bar */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <AppointmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by doctor or specialty..."
              className="pl-12 h-12 rounded-2xl border-gray-100 focus:border-brand-dark focus:ring-0 text-sm bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="h-12 w-12 rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-brand-dark hover:bg-brand-light/10 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. List Grid */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredAppointments.length > 0 ? (
            <div className="grid gap-6">
              {filteredAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </div>
          ) : (
            <AppointmentEmptyState type={activeTab} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
