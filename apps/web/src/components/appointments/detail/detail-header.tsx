'use client';

import {
  Calendar,
  ChevronLeft,
  Download,
  MoreVertical,
  Share2,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DetailHeaderProps {
  status:
    | 'pending'
    | 'awaiting_payment'
    | 'confirmed'
    | 'cancelled'
    | 'completed';
  type: 'video' | 'in-person';
  appointmentId: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  awaiting_payment: {
    label: 'Awaiting Payment',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
  },
};

export function AppointmentDetailHeader({
  status,
  type,
  appointmentId,
}: DetailHeaderProps) {
  const config = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumbs & Top Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/appointments"
          className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-brand-light/10">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back to Appointments
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-100/50 hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4 text-brand-dark" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-100/50 hover:bg-gray-50"
          >
            <MoreVertical className="w-4 h-4 text-brand-dark" />
          </Button>
        </div>
      </div>

      {/* 2. Title & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-black">
              Appointment Detail
            </h1>
            <div
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
                config.color,
              )}
            >
              {config.label}
            </div>
          </div>
          <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
            ID:{' '}
            <span className="text-brand-dark font-bold select-all">
              {appointmentId}
            </span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Verified Consultation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status === 'confirmed' && (
            <>
              <Button
                variant="outline"
                className="rounded-xl h-12 px-6 text-xs font-bold gap-2 border-brand-light/20 hover:bg-brand-light/5"
              >
                <Calendar className="w-4 h-4" />
                Reschedule
              </Button>
              {type === 'video' ? (
                <Button
                  variant="dark"
                  className="rounded-xl h-12 px-8 text-xs font-bold gap-2 shadow-xl shadow-brand-dark/10"
                >
                  Join Video Session
                  <Video className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="dark"
                  className="rounded-xl h-12 px-8 text-xs font-bold gap-2 shadow-xl shadow-brand-dark/10"
                >
                  Open Clinic Map
                </Button>
              )}
            </>
          )}

          {status === 'completed' && (
            <>
              <Button
                variant="outline"
                className="rounded-xl h-12 px-6 text-xs font-bold gap-2 border-brand-light/20"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button
                variant="dark"
                className="rounded-xl h-12 px-8 text-xs font-bold gap-2 shadow-xl shadow-brand-dark/10"
              >
                Book Follow-up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
