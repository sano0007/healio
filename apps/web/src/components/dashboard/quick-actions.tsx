'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Stethoscope,
  ClipboardList,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const actions = [
  {
    title: 'Find a Doctor',
    desc: 'Search for top especialistas nearby across all medical departments.',
    icon: Search,
    href: '/doctors',
    color: 'bg-blue-100/50 text-blue-600 border-blue-100',
  },
  {
    title: 'Book Appointment',
    desc: 'Schedule a virtual or in-person consultation with your doctor.',
    icon: Calendar,
    href: '/appointments/book',
    color: 'bg-emerald-100/50 text-emerald-600 border-emerald-100',
  },
  {
    title: 'AI Symptom Checker',
    desc: 'Get an instant preliminary health assessment powered by AI.',
    icon: Stethoscope,
    href: '/symptom-checker',
    color: 'bg-brand-light/30 text-brand-dark border-brand-light/20',
  },
  {
    title: 'View Records',
    desc: 'Access your medical history, test reports, and past prescriptions.',
    icon: ClipboardList,
    href: '/records',
    color: 'bg-purple-100/50 text-purple-600 border-purple-100',
  },
];

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

export function QuickActions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {actions.map((action) => (
        <motion.div key={action.title} variants={item}>
          <Link
            href={action.href}
            className={cn(
              'group relative block p-6 bg-white rounded-3xl border border-gray-100 hover:border-brand-dark/20 hover:shadow-xl hover:shadow-brand-dark/5 transition-all duration-300',
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300',
                action.color,
              )}
            >
              <action.icon className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-brand-black mb-2 flex items-center gap-2">
              {action.title}
              <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-brand-dark transition-colors" />
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
              {action.desc}
            </p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
