'use client';

import { motion } from 'framer-motion';
import {
  BellRing,
  Mail,
  Smartphone,
  Info,
  ShieldCheck,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-12 pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Alerts */}
        <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-black">
                  Email Alerts
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <div className="w-12 h-6 bg-brand-dark rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                label: 'Appointment Reminders',
                icon: Calendar,
                description:
                  'Get notified 24 hours before your scheduled session.',
                active: true,
              },
              {
                label: 'Payment & Invoices',
                icon: CreditCard,
                description:
                  'Instant receipts and billing statements via email.',
                active: true,
              },
              {
                label: 'Clinical Updates',
                icon: ShieldCheck,
                description: 'Important platform and policy updates.',
                active: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between group/item"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-brand-dark transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">
                      {item.label}
                    </h4>
                    <p className="text-[10px] font-medium text-gray-400 max-w-[180px]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-10 h-5 rounded-full relative p-1 cursor-pointer',
                    item.active ? 'bg-emerald-500' : 'bg-gray-100',
                  )}
                >
                  <div
                    className={cn(
                      'w-3 h-3 bg-white rounded-full absolute',
                      item.active ? 'right-1' : 'left-1',
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-brand-light/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>

        {/* SMS Alerts */}
        <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-black">
                  SMS Alerts
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  +94 77 •••• 567
                </p>
              </div>
            </div>
            <div className="w-12 h-6 bg-brand-dark rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                label: 'Emergency Alerts',
                icon: BellRing,
                description:
                  'Critical alerts regarding your real-time health updates.',
                active: true,
              },
              {
                label: 'Marketing & Promos',
                icon: Info,
                description:
                  'Get notified about new specialists and healthcare deals.',
                active: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between group/item"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-brand-dark transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">
                      {item.label}
                    </h4>
                    <p className="text-[10px] font-medium text-gray-400 max-w-[180px]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'w-10 h-5 rounded-full relative p-1 cursor-pointer',
                    item.active ? 'bg-emerald-500' : 'bg-gray-100',
                  )}
                >
                  <div
                    className={cn(
                      'w-3 h-3 bg-white rounded-full absolute',
                      item.active ? 'right-1' : 'left-1',
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-brand-light/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>

      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row gap-8 items-center text-center md:text-left transition-all hover:bg-white shadow hover:shadow-xl hover:shadow-brand-dark/5">
        <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-brand-dark shadow-sm shrink-0 border border-brand-light/10">
          <Info className="w-8 h-8" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-brand-black">
            Manage Push Notification Preferences?
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            To manage browser and mobile push alerts, please visit your
            account's browser settings.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest border-brand-dark group"
        >
          Advanced Controls
        </Button>
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
