'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Plus,
  Save,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDoctorAppointments } from '@/hooks/use-doctor-appointments';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function IssuePrescriptionPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: appointments } = useDoctorAppointments();
  const appointment = appointments?.find(
    (a) => a._id === resolvedParams.appointmentId,
  );

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);

  const issueMutation = useMutation({
    mutationFn: async () => {
      const validMeds = medications.filter(
        (m) => m.name.trim() && m.dosage.trim(),
      );
      await api.doctors.issuePrescription({
        patientId: appointment?.patientId ?? '',
        appointmentId: resolvedParams.appointmentId,
        medications: validMeds,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
      router.push('/doctor/appointments');
    },
  });

  const addMedication = () => {
    setMedications((prev) => [
      ...prev,
      { name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const canSubmit = diagnosis.trim() && medications.some((m) => m.name.trim());

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        <Link
          href="/doctor/appointments"
          className="hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Appointments
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-dark">Issue Prescription</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-brand-black tracking-tight">
          Issue Prescription
        </h1>
        <p className="text-sm text-gray-400 font-medium">
          Create a digital prescription for your patient
        </p>
      </div>

      {/* Patient Info Card */}
      {appointment && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-black">Patient</h3>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              ID: {appointment.patientId.slice(0, 8)}
            </p>
            {appointment.notes && (
              <p className="text-xs text-gray-400 italic mt-1">
                "{appointment.notes}"
              </p>
            )}
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Scheduled
            </p>
            <p className="text-sm font-bold text-brand-black">
              {new Date(appointment.scheduledAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </motion.div>
      )}

      {/* Diagnosis */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-brand-dark" />
          <h2 className="text-lg font-bold text-brand-black">Diagnosis</h2>
        </div>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g., Type 2 Diabetes Mellitus, Hypertension"
          className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all"
        />
      </div>

      {/* Medications */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-dark text-white flex items-center justify-center text-sm font-black">
              Rx
            </div>
            <h2 className="text-lg font-bold text-brand-black">Medications</h2>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
            onClick={addMedication}
          >
            <Plus className="w-4 h-4" />
            Add Medication
          </Button>
        </div>

        <div className="space-y-4">
          {medications.map((med, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-12 gap-4 items-end"
            >
              <div className="col-span-12 sm:col-span-3">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) =>
                    updateMedication(index, 'name', e.target.value)
                  }
                  placeholder="e.g., Metformin"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Dosage
                </label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedication(index, 'dosage', e.target.value)
                  }
                  placeholder="e.g., 500mg"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Frequency
                </label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) =>
                    updateMedication(index, 'frequency', e.target.value)
                  }
                  placeholder="e.g., 1-0-1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Duration
                </label>
                <input
                  type="text"
                  value={med.duration}
                  onChange={(e) =>
                    updateMedication(index, 'duration', e.target.value)
                  }
                  placeholder="e.g., 30 days"
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  className="h-11 w-11 rounded-xl p-0 text-gray-300 hover:text-red-500 hover:bg-red-50"
                  onClick={() => removeMedication(index)}
                  disabled={medications.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-brand-black">
          Clinical Notes (Optional)
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional instructions, warnings, or follow-up notes..."
          rows={4}
          className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Link href="/doctor/appointments">
          <Button
            variant="outline"
            className="h-14 rounded-2xl px-10 text-[11px] font-black uppercase tracking-widest"
          >
            Cancel
          </Button>
        </Link>
        <Button
          variant="dark"
          className="h-14 rounded-2xl px-10 text-[11px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-brand-dark/10"
          onClick={() => issueMutation.mutate()}
          disabled={!canSubmit || issueMutation.isPending}
        >
          <Save className="w-4 h-4" />
          {issueMutation.isPending ? 'Issuing...' : 'Issue Prescription'}
        </Button>
      </div>
    </div>
  );
}
