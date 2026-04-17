'use client';

import { Calendar, Clock, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface OrderSummaryProps {
  doctor: {
    name: string;
    specialization: string;
    image: string;
    fee: number;
  };
  schedule: {
    date: string;
    time: string;
  };
}

export function OrderSummary({ doctor, schedule }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const platformFee = 10;
  const tax = 5;
  const total = doctor.fee + platformFee + tax;

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* 1. Appointment Info Card */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-light/10 flex items-center justify-center text-brand-dark border border-brand-light/20 overflow-hidden">
            <img
              src={doctor.image || '/images/doctor-1.png'}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-black">
              {doctor.name}
            </h3>
            <p className="text-xs font-medium text-gray-400 italic">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-brand-dark" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Date
              </span>
              <span className="text-[10px] font-bold text-brand-black">
                {schedule.date}
              </span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
            <Clock className="w-4 h-4 text-brand-dark" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Time
              </span>
              <span className="text-[10px] font-bold text-brand-black">
                {schedule.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Fee Breakdown */}
      <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6 flex-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">
              Consultation Fee
            </span>
            <span className="text-sm font-black text-brand-black">
              ${doctor.fee.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400">
                Platform Service Fee
              </span>
              <Info className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <span className="text-sm font-black text-brand-black">
              ${platformFee.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">
              Government Tax
            </span>
            <span className="text-sm font-black text-brand-black">
              ${tax.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Promo Code Input */}
        <div className="relative group">
          <Input
            placeholder="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="h-12 rounded-xl bg-white border-gray-100 pr-24 text-xs font-bold"
          />
          <Button
            variant="ghost"
            className="absolute right-1 top-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-dark hover:bg-brand-dark/5"
          >
            Apply
          </Button>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total Amount
            </span>
            <span className="text-2xl font-black text-brand-dark tracking-tighter">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[8px] font-black text-brand-black uppercase tracking-widest">
              Secure Payment
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
