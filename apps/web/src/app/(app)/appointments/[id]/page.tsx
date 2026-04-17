'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AppointmentDetailHeader } from '@/components/appointments/detail/detail-header';
import { InfoGrid } from '@/components/appointments/detail/info-grid';
import { ClinicalOutcome } from '@/components/appointments/detail/clinical-outcome';
import { DocumentList } from '@/components/appointments/detail/document-list';
import { Skeleton } from '@/components/ui/skeleton';

interface AppointmentDetail {
  id: string;
  status:
    | 'pending'
    | 'awaiting_payment'
    | 'confirmed'
    | 'cancelled'
    | 'completed';
  type: 'video' | 'in-person';
  doctor: {
    name: string;
    specialization: string;
    image: string;
    fee: number;
  };
  patient: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  };
  schedule: {
    date: string;
    time: string;
    duration: string;
    type: string;
  };
  billing: {
    fee: number;
    tax: number;
    method: string;
  };
  medical?: {
    diagnosis: string;
    notes: string;
    prescriptions: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }[];
  };
  documents: { name: string; size: string; type: 'pdf' | 'jpg' | 'png' }[];
  paymentUrl?: string;
}

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const appointmentId = resolvedParams.id;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setIsLoading(true);
        const apt = await api.appointments.getById(appointmentId);

        const [doctorInfo, patientInfo] = await Promise.all([
          api.doctors.getById(apt.doctorId).catch(() => null),
          api.patients.getMe().catch(() => null),
        ]);

        const scheduledDate = new Date(apt.scheduledAt);
        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        setAppointment({
          id: apt._id,
          status: apt.status as AppointmentDetail['status'],
          type: apt.type || 'video',
          doctor: {
            name: doctorInfo?.name || 'Doctor',
            specialization: doctorInfo?.specialty || 'General Physician',
            image: '/images/doctor-1.png',
            fee: doctorInfo?.consultationFee || 0,
          },
          patient: {
            name: patientInfo?.name || 'Patient',
            relationship: 'Self',
            email: patientInfo?.email || '',
            phone: patientInfo?.phone || '',
          },
          schedule: {
            date: formattedDate,
            time: formattedTime,
            duration: '30 mins',
            type: apt.type || 'video',
          },
          billing: {
            fee: doctorInfo?.consultationFee || 0,
            tax: 0,
            method: apt.paymentStatus || 'Pending',
          },
          medical: apt.prescriptions
            ? {
                diagnosis: apt.notes || 'No diagnosis recorded',
                notes: apt.notes || '',
                prescriptions: apt.prescriptions,
              }
            : undefined,
          documents: [],
          paymentUrl: apt.checkoutUrl,
        });
      } catch (err) {
        setError('Failed to load appointment details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-12 animate-pulse px-4">
        <Skeleton className="h-44 w-full rounded-[2.5rem]" />
        <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 text-center">
        <p className="text-red-500">{error || 'Appointment not found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-16">
      {/* 1. Header with Status & Breadcrumbs */}
      <AppointmentDetailHeader
        status={appointment.status}
        type={appointment.type}
        appointmentId={appointment.id}
      />

      {/* 2. Core Info Grid (Patient, Schedule, Billing) */}
      <InfoGrid
        doctor={appointment.doctor}
        patient={appointment.patient}
        schedule={appointment.schedule}
        billing={appointment.billing}
        paymentUrl={appointment.paymentUrl}
        appointmentStatus={appointment.status}
      />

      {/* 3. Clinical Outcomes (Only for completed) */}
      {appointment.status === 'completed' && appointment.medical && (
        <section className="space-y-10">
          <div className="h-px bg-gray-100" />
          <ClinicalOutcome
            diagnosis={appointment.medical.diagnosis}
            notes={appointment.medical.notes}
            prescriptions={appointment.medical.prescriptions}
          />
        </section>
      )}

      {/* 4. Documents & Attachments */}
      {appointment.documents.length > 0 && (
        <section className="space-y-10">
          <div className="h-px bg-gray-100" />
          <DocumentList documents={appointment.documents} />
        </section>
      )}

      {/* 5. Footer Help Overlay */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-50 gap-6">
        <p className="text-sm text-gray-400 font-medium text-center md:text-left">
          Need help with this appointment?{' '}
          <span className="text-brand-dark font-bold underline cursor-pointer hover:text-brand-light transition-colors">
            Contact Support
          </span>
        </p>
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-dark transition-all">
            Digital Signature Secured
          </span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
        </div>
      </div>
    </div>
  );
}
