'use client';

import { User, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PatientInfoStepProps {
  onNext: (data: any) => void;
}

export function PatientInfoStep({ onNext }: PatientInfoStepProps) {
  const [target, setTarget] = useState<'self' | 'other'>('self');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-black">
          Who is this appointment for?
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Please select the patient for this consultation.
        </p>
      </div>

      {/* Selector */}
      <div className="grid sm:grid-cols-2 gap-6">
        <button
          onClick={() => setTarget('self')}
          className={cn(
            'flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-300 gap-4 group',
            target === 'self'
              ? 'bg-white border-brand-dark shadow-xl shadow-brand-dark/5'
              : 'bg-gray-50/50 border-gray-100 hover:border-brand-light/30',
          )}
        >
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
              target === 'self'
                ? 'bg-brand-dark text-white'
                : 'bg-white text-gray-400 group-hover:text-brand-dark',
            )}
          >
            <User className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-brand-black mb-1">Myself</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Book for John Doe
            </p>
          </div>
        </button>

        <button
          onClick={() => setTarget('other')}
          className={cn(
            'flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-300 gap-4 group',
            target === 'other'
              ? 'bg-white border-brand-dark shadow-xl shadow-brand-dark/5'
              : 'bg-gray-50/50 border-gray-100 hover:border-brand-light/30',
          )}
        >
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
              target === 'other'
                ? 'bg-brand-dark text-white'
                : 'bg-white text-gray-400 group-hover:text-brand-dark',
            )}
          >
            <Users className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-brand-black mb-1">
              Family Member
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Book for someone else
            </p>
          </div>
        </button>
      </div>

      {/* Dependent Form (Conditional) */}
      {target === 'other' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-6 pt-10 border-t border-gray-50"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Dependent name"
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-dark text-sm bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                Age
              </label>
              <input
                type="number"
                placeholder="Patient age"
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:border-brand-dark text-sm bg-gray-50/30"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Button */}
      <div className="pt-10 flex justify-end">
        <Button
          variant="dark"
          onClick={() => onNext({ target })}
          className="h-14 px-10 rounded-2xl text-sm font-bold gap-2 shadow-xl shadow-brand-dark/10"
        >
          Continue Booking
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
