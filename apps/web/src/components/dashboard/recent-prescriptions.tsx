'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Eye, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePrescriptions } from '@/hooks/use-prescriptions';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function RecentPrescriptions() {
  const { data: prescriptions, isLoading } = usePrescriptions();

  const recent = (prescriptions ?? []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-6 w-44 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">
            Recent Prescriptions
          </h2>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          No prescriptions found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-black">
            Recent Prescriptions
          </h2>
        </div>
        <Link
          href="/prescriptions"
          className="text-sm font-semibold text-brand-dark hover:underline flex items-center gap-1 group"
        >
          View all{' '}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {recent.map((prescription, idx) => (
          <motion.div
            key={prescription._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-brand-light/30 hover:bg-white transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand-dark transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-black leading-none mb-1">
                  {prescription.doctorName}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                  <span>{formatDate(prescription.issuedAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-brand-dark/70">
                    {prescription.medications.length} Medication
                    {prescription.medications.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="success"
                className="hidden sm:flex text-[10px] px-2 py-0"
              >
                Active
              </Badge>
              <Link
                href={`/prescriptions/${prescription._id}`}
                className="p-2 rounded-xl text-gray-400 hover:text-brand-dark hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-none hover:shadow-sm"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
