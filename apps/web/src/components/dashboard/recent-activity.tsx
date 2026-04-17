'use client';

import { motion } from 'framer-motion';
import { Pill, Calendar, Bell, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: '1',
    type: 'prescription',
    title: 'New Prescription',
    desc: 'Dr. Sarah Johnson issued a new prescription for your cardiology consultation.',
    time: '2 hours ago',
    icon: Pill,
    color: 'text-emerald-500 bg-emerald-50',
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment Confirmed',
    desc: 'Your appointment with Dr. Michael Chen has been confirmed for tomorrow at 2:15 PM.',
    time: '5 hours ago',
    icon: Calendar,
    color: 'text-blue-500 bg-blue-50',
  },
  {
    id: '3',
    type: 'record',
    title: 'Document Uploaded',
    desc: 'Your blood test results from City Labs have been successfully uploaded to your records.',
    time: 'Yesterday',
    icon: FileText,
    color: 'text-purple-500 bg-purple-50',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-light/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-brand-dark" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">
            Recent Activity
          </h2>
        </div>
        <Link
          href="/notifications"
          className="text-sm font-semibold text-brand-dark hover:underline flex items-center gap-1 group"
        >
          See all{' '}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-6">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 group cursor-pointer"
          >
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110',
                activity.color,
              )}
            >
              <activity.icon className="w-5 h-5" />
            </div>

            <div className="flex-1 pb-6 border-b border-gray-100 group-last:border-none">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-bold text-brand-black group-hover:text-brand-dark transition-colors">
                  {activity.title}
                </h3>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  {activity.time}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                {activity.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
