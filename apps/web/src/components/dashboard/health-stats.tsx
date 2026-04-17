'use client';

import { useMemo } from 'react';
import { Calendar, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { motion } from 'framer-motion';
import { useAppointments } from '@/hooks/use-appointments';

export function HealthStats() {
  const { data: appointments } = useAppointments();

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNext7Days = new Date(now);
    endOfNext7Days.setDate(now.getDate() + 7);

    const monthly =
      appointments?.filter((a) => new Date(a.scheduledAt) >= startOfMonth) ??
      [];
    const upcoming =
      appointments?.filter((a) => {
        const d = new Date(a.scheduledAt);
        return d >= now && a.status !== 'completed' && a.status !== 'cancelled';
      }) ?? [];
    const next7Days = upcoming.filter(
      (a) => new Date(a.scheduledAt) <= endOfNext7Days,
    );
    const completed =
      appointments?.filter((a) => a.status === 'completed') ?? [];
    const lastCompleted = [...completed].sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    )[0];

    let lastConsultation = '';
    if (lastCompleted) {
      const diffMs =
        now.getTime() - new Date(lastCompleted.scheduledAt).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) lastConsultation = 'Today';
      else if (diffDays === 1) lastConsultation = '1d ago';
      else lastConsultation = `${diffDays}d ago`;
    }

    return [
      {
        title: 'Total Appointments',
        value: String(monthly.length),
        unit: 'this month',
        icon: UserCheck,
        trend: {
          value: `${completed.length} completed`,
          type: 'neutral' as const,
        },
      },
      {
        title: 'Upcoming Sessions',
        value: String(next7Days.length),
        unit: 'next 7 days',
        icon: Clock,
        trend: { value: `${upcoming.length} total`, type: 'neutral' as const },
      },
      {
        title: 'Last Consultation',
        value: lastConsultation || '—',
        unit: lastCompleted
          ? new Date(lastCompleted.scheduledAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : 'no records',
        icon: Calendar,
        trend: {
          value: lastCompleted ? 'Completed' : 'No records',
          type: 'positive' as const,
        },
      },
      {
        title: 'Health Progress',
        value: '85%',
        unit: 'Recovery',
        icon: CheckCircle2,
        trend: { value: '+5%', type: 'positive' as const },
      },
    ];
  }, [appointments]);

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <StatCard
            {...stat}
            className="rounded-3xl border-gray-100/50 shadow-sm"
          />
        </motion.div>
      ))}
    </div>
  );
}
