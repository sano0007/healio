'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Droplet,
  Ruler,
  Scale,
  AlertCircle,
  Pill,
  Trash2,
  Plus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MedicalInfoTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-12 pb-20"
    >
      {/* Vitals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Blood Type',
            value: 'O+',
            icon: Droplet,
            color: 'text-red-500',
            bg: 'bg-red-50',
          },
          {
            label: 'Height',
            value: '178 cm',
            icon: Ruler,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
          },
          {
            label: 'Weight',
            value: '72 kg',
            icon: Scale,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
          },
        ].map((vital, i) => (
          <div
            key={i}
            className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 hover:shadow-xl hover:shadow-brand-dark/5 transition-all group"
          >
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform',
                vital.bg,
                vital.color,
              )}
            >
              <vital.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                {vital.label}
              </p>
              <p className="text-2xl font-bold text-brand-black">
                {vital.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Allergies & Chronic Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Allergies */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-brand-black">
                Allergy Records
              </h3>
              <div className="px-2 py-0.5 bg-red-50 text-red-500 rounded-md text-[9px] font-bold uppercase tracking-widest">
                Clinical Alert
              </div>
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-xl border-gray-100 text-[10px] font-bold uppercase tracking-widest gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { item: 'Penicillin', severity: 'High', since: 'Childhood' },
              { item: 'Latex', severity: 'Moderate', since: '2018' },
            ].map((allergy, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">
                      {allergy.item}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Since {allergy.since}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full',
                        allergy.severity === 'High'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-orange-50 text-orange-600',
                      )}
                    >
                      {allergy.severity} Risk
                    </span>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-brand-black">
                Chronic Metadata
              </h3>
              <div className="px-2 py-0.5 bg-brand-light/20 text-brand-dark rounded-md text-[9px] font-bold uppercase tracking-widest">
                Active Care
              </div>
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-xl border-gray-100 text-[10px] font-bold uppercase tracking-widest gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Metadata
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                item: 'Type 2 Diabetes',
                status: 'Managed',
                dr: 'Dr. Sarah Johnson',
              },
            ].map((condition, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-black">
                      {condition.item}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      Lead: {condition.dr}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      {condition.status}
                    </span>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 bg-brand-dark rounded-[3rem] text-white relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-brand-light" />
              <h3 className="text-xl font-bold">
                Clinical Data Synchronization
              </h3>
            </div>
            <p className="text-sm text-brand-light/60 font-medium">
              Would you like to automatically sync your medical records with
              wearable devices (Apple Health / Google Fit)? This ensures your
              doctors always have up-to-date vitals.
            </p>
          </div>
          <Button
            variant="dark"
            className="h-14 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-brand-light text-brand-dark hover:bg-white shadow-xl shadow-brand-dark/20 transition-all"
          >
            Connect Device Hub
          </Button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
