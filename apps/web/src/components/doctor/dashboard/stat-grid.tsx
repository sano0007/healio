'use client';

import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDoctorAppointments } from '@/hooks/use-doctor-appointments';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatGrid() {
  const { data: appointments } = useDoctorAppointments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount =
    appointments?.filter((a) => {
      const d = new Date(a.scheduledAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length ?? 0;

  const pendingCount =
    appointments?.filter((a) => a.status === 'pending').length ?? 0;

  const confirmedCount =
    appointments?.filter((a) => a.status === 'confirmed').length ?? 0;

  const stats = [
    {
      label: "Today's Schedule",
      value: todayCount,
      subtext: `${appointments?.filter((a) => a.status === 'completed').length ?? 0} completed`,
      icon: CalendarDays,
      color: 'bg-blue-50 text-blue-600',
      trend: `${pendingCount} pending`,
      active: true,
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      subtext: 'Needs review',
      icon: UserPlus,
      color: 'bg-brand-light/20 text-brand-dark',
      trend: pendingCount > 0 ? 'Priority: High' : 'All clear',
      active: false,
    },
    {
      label: 'Consultations',
      value: confirmedCount,
      subtext: 'Confirmed',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
      trend: `${appointments?.length ?? 0} total`,
      active: false,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={item}
          className="group relative p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-brand-dark/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div
              className={cn(
                'p-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110',
                stat.color,
              )}
            >
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 mb-2">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  {stat.trend}
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-200 group-hover:text-brand-dark transition-colors" />
            </div>
          </div>

          <div className="mt-8 space-y-1 relative z-10">
            <h3 className="text-4xl font-bold text-brand-black tracking-tighter">
              {stat.value}
            </h3>
            <div>
              <p className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <p className="text-[10px] font-medium text-gray-400 italic">
                {stat.subtext}
              </p>
            </div>
          </div>

          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-brand-light/10 transition-colors" />
        </motion.div>
      ))}
    </motion.div>
  );
}
