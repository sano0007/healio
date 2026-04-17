'use client';

import { motion } from 'framer-motion';
import { CloudSun, CalendarDays } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export function WelcomeBanner({ name }: { name: string }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-brand-dark rounded-[2rem] p-8 lg:p-10 text-white shadow-xl shadow-brand-dark/10"
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            src="/images/doctor-1.png"
            className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-white/10"
          />
          <div>
            <div className="flex items-center gap-2 text-brand-light/80 mb-1">
              <CloudSun className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Good Morning
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Hello, {name} 👋
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 self-start md:self-center">
          <CalendarDays className="w-5 h-5 text-brand-light" />
          <p className="text-sm font-medium">{today}</p>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -ml-24 -mb-24" />
    </motion.div>
  );
}
