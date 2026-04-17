'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  CreditCard,
  Video,
  Pill,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type NotificationType =
  | 'appointment'
  | 'payment'
  | 'consultation'
  | 'prescription'
  | 'verification';

interface NotificationListItemProps {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link: string;
}

const typeConfig = {
  appointment: {
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  payment: {
    icon: <CreditCard className="w-4 h-4" />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  consultation: {
    icon: <Video className="w-4 h-4" />,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  prescription: {
    icon: <Pill className="w-4 h-4" />,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  verification: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
};

export function NotificationListItem({
  type,
  title,
  description,
  timestamp,
  isRead,
  link,
}: NotificationListItemProps) {
  const config = typeConfig[type];

  return (
    <Link href={link}>
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          'group relative p-6 bg-white rounded-[2rem] border transition-all flex items-start gap-6',
          isRead
            ? 'border-gray-50 opacity-80'
            : 'border-brand-light/20 shadow-sm border-l-4 border-l-brand-dark',
        )}
      >
        {/* Type Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0',
            config.color,
          )}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h4
              className={cn(
                'text-sm font-bold tracking-tight truncate',
                isRead ? 'text-gray-600' : 'text-brand-black',
              )}
            >
              {title}
            </h4>
            <div className="flex items-center gap-2 shrink-0">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {timestamp}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium leading-relaxed italic group-hover:text-gray-500 transition-colors">
            {description}
          </p>
        </div>

        {/* Interaction indicator */}
        <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white transition-all shadow-sm">
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {!isRead && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-brand-dark rounded-full shadow-lg shadow-brand-dark/20 animate-pulse" />
        )}
      </motion.div>
    </Link>
  );
}
