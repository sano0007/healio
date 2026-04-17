'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Fingerprint,
  History,
  ExternalLink,
  Key,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export function SecurityTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-12 pb-20"
    >
      {/* 2FA Section */}
      <div className="p-10 bg-brand-dark rounded-[3rem] text-white space-y-8 relative overflow-hidden group">
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-light" />
              <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
            </div>
            <p className="text-sm text-brand-light/60 font-medium max-w-sm">
              Add an extra layer of security to your clinical account by
              requiring a code from your mobile device.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-3xl border border-white/10 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-light/80">
              Status: ON
            </span>
            <div className="w-12 h-6 bg-brand-light rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-brand-dark rounded-full absolute right-1" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 group-hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-brand-light/20 flex items-center justify-center text-brand-light font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">SMS Verification</h4>
              <p className="text-[10px] font-medium text-brand-light/40">
                +94 •••• 567
              </p>
            </div>
          </div>
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all cursor-not-allowed">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight">
                Authenticator App
              </h4>
              <p className="text-[10px] font-medium">Not configured</p>
            </div>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      </div>

      {/* Password Reset Section */}
      <div className="space-y-10">
        <div className="flex items-center gap-4 px-2">
          <h3 className="text-lg font-bold text-brand-black">
            Password Management
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                Current Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                New Healthcare Password
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                <Input
                  type="password"
                  placeholder="Min. 12 characters"
                  className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                Confirm Identity Key
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
            <h4 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] px-2">
              Security Checklist
            </h4>
            <div className="space-y-4">
              {[
                'Minimum of 12 clinical-grade characters',
                'Includes specialized medical symbols/numbers',
                'No repetitive identity patterns',
                'Unique from last 5 healthcare keys',
              ].map((rule, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {rule}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200/50">
              <p className="text-[9px] font-medium text-gray-400 italic leading-relaxed">
                Last password change: 4 months ago. We recommend refreshing your
                security key every 6 months.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold text-brand-black">
              Active Device Sessions
            </h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <Button
            variant="ghost"
            className="text-[10px] font-black uppercase tracking-widest text-brand-dark flex items-center gap-2"
          >
            Sign Out All Devices
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="space-y-4">
          {[
            {
              device: 'MacBook Pro M3',
              location: 'Colombo, Sri Lanka',
              status: 'Active Now',
              icon: Smartphone,
            },
            {
              device: 'iPhone 15 Pro',
              location: 'Kandy, Sri Lanka',
              status: 'Last active 2h ago',
              icon: Smartphone,
            },
          ].map((session, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-brand-light/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-brand-dark transition-colors">
                  <session.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black">
                    {session.device}
                  </h4>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
                    {session.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    'text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full',
                    session.status === 'Active Now'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-gray-50 text-gray-400',
                  )}
                >
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Minimal cn helper since I am in a task and want to be efficient
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
