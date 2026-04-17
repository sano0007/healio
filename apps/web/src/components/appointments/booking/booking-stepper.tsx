'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, name: 'Patient Info', description: 'Who is this for?' },
  { id: 2, name: 'Consultation', description: 'Reason & Details' },
  { id: 3, name: 'Payment', description: 'Review & Pay' },
];

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-12">
      <ol className="flex items-center justify-between w-full relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-brand-dark -translate-y-1/2 z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <li
              key={step.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted
                    ? 'bg-brand-dark border-brand-dark'
                    : isActive
                      ? 'bg-white border-brand-dark shadow-lg shadow-brand-dark/20'
                      : 'bg-white border-gray-200',
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isActive ? 'text-brand-dark' : 'text-gray-400',
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Labels (Desktop) */}
              <div className="absolute top-12 flex flex-col items-center min-w-[120px] text-center">
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-widest',
                    isActive || isCompleted
                      ? 'text-brand-dark'
                      : 'text-gray-400',
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
