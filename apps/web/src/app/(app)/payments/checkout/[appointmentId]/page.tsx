'use client';

import { use, useState } from 'react';
import { OrderSummary } from '@/components/payments/order-summary';
import { CheckoutForm } from '@/components/payments/checkout-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppointments } from '@/hooks/use-appointments';

type CheckoutStatus = 'idle' | 'processing' | 'success' | 'error';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<CheckoutStatus>('idle');

  const { data: appointments, isLoading } = useAppointments();

  const appointment = appointments?.find(
    (a) => a._id === resolvedParams.appointmentId,
  );

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        router.push('/appointments');
      }, 3000);
    }, 2800);
  };

  if (isLoading || !appointment) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-12 animate-pulse px-4">
        <Skeleton className="h-24 w-1/3 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-[3rem]" />
          <Skeleton className="h-[600px] rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-12">
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 opacity-70">
          <Link
            href="/dashboard"
            className="hover:text-brand-dark transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href="/appointments"
            className="hover:text-brand-dark transition-colors"
          >
            Appointments
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-dark font-black underline underline-offset-4">
            Checkout
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-brand-black tracking-tighter">
              Secure Checkout
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
              Appointment Ref:{' '}
              <span className="text-brand-dark font-black">
                {appointment?._id ?? resolvedParams.appointmentId}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none mb-0.5">
                Payment Security
              </span>
              <span className="text-[9px] font-bold text-emerald-600 opacity-80">
                PCI-DSS Compliant Infrastructure
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Success Overlay */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-white/60 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white rounded-[3.5rem] p-12 border border-brand-light/20 shadow-2xl flex flex-col items-center text-center space-y-8"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/20 relative">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-emerald-400 border-dashed rounded-full"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-black tracking-tight">
                  Payment Completed
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 leading-relaxed">
                  Your consultation with **
                  {appointment?.doctor?.name ?? 'Doctor'}** is successfully
                  confirmed.
                </p>
              </div>

              <div className="w-full h-px bg-gray-50 ring-1 ring-gray-100" />

              <p className="text-[10px] font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
                <span className="opacity-50 italic">
                  Redirecting to Dashboard
                </span>
                <SpinnerDark />
              </p>

              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest gap-2"
                >
                  Dismiss
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 order-2 lg:order-1 pt-6 lg:pt-0">
          <div className="px-2 pb-10 border-b border-gray-50 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-brand-dark text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-brand-dark/20">
              01
            </span>
            <p className="text-[11px] font-black text-brand-black uppercase tracking-widest">
              Select Payment Method
            </p>
          </div>

          <div className="py-10">
            <CheckoutForm
              status={status}
              onPay={handlePay}
              total={(appointment?.doctor?.consultationFee ?? 0) + 10 + 5}
            />
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-dark shadow-sm shrink-0 border border-gray-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-black uppercase tracking-widest">
                Guaranteed Data Privacy
              </span>
              <p className="text-[10px] font-medium text-gray-400 italic leading-relaxed">
                By clicking authorize, you agree to our Terms of Service. Your
                data is encrypted and signature-signed for HIPAA-grade security.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-12">
            <div className="px-2 pb-10 flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-brand-light brightness-150 text-brand-dark text-[10px] font-black flex items-center justify-center shadow-lg shadow-brand-light/20">
                02
              </span>
              <p className="text-[11px] font-black text-brand-black uppercase tracking-widest">
                Order Review
              </p>
            </div>
            <OrderSummary
              doctor={{
                name: appointment?.doctor?.name ?? 'Doctor',
                specialization: appointment?.doctor?.specialty ?? 'Specialist',
                image: '/images/doctor-1.png',
                fee: appointment?.doctor?.consultationFee ?? 0,
              }}
              schedule={{
                date: appointment
                  ? new Date(appointment.scheduledAt).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      },
                    )
                  : '',
                time: appointment
                  ? new Date(appointment.scheduledAt).toLocaleTimeString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      },
                    )
                  : '',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpinnerDark() {
  return (
    <div className="w-3.5 h-3.5 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
  );
}
