"use client";

import { use, useState, useEffect } from "react";
import { AppointmentDetailHeader } from "@/components/appointments/detail/detail-header";
import { InfoGrid } from "@/components/appointments/detail/info-grid";
import { ClinicalOutcome } from "@/components/appointments/detail/clinical-outcome";
import { DocumentList } from "@/components/appointments/detail/document-list";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const mockAppointmentDetail = {
  id: "HL-98231-A",
  status: "completed" as const,
  type: "video" as const,
  doctor: {
    name: "Dr. Sarah Johnson",
    specialization: "Senior Cardiologist",
    image: "/images/doctor-1.png",
    fee: 150,
  },
  patient: {
    name: "John Doe",
    relationship: "Self",
    email: "john.doe@example.com",
    phone: "+1 (555) 000-1234",
  },
  schedule: {
    date: "Tuesday, July 7, 2026",
    time: "09:30 AM",
    duration: "30 mins",
    type: "video",
  },
  billing: {
    fee: 150,
    tax: 5,
    method: "Mastercard x-4242",
  },
  medical: {
    diagnosis: "Mild Hypertension & Sinus Tachycardia",
    notes: "Patient reported occasional heart palpitations during exercise. Physical exam via video shows no immediate distress. Blood pressure readings from home monitor (145/90) suggest mild stage 1 hypertension. Recommended lifestyle changes and follow-up in 2 weeks with a stress test if symptoms persist.",
    prescriptions: [
      { name: "Amlodipine Besylate", dosage: "5mg", frequency: "Once daily (Morning)", duration: "30 Days" },
      { name: "Magnesium Citrate", dosage: "250mg", frequency: "Once daily (Night)", duration: "15 Days" }
    ],
  },
  documents: [
    { name: "ECG_Report_June_2026.pdf", size: "1.2 MB", type: "pdf" as const },
    { name: "Blood_Test_Vitals.pdf", size: "850 KB", type: "pdf" as const }
  ]
};

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 space-y-12 animate-pulse px-4">
        <Skeleton className="h-44 w-full rounded-[2.5rem]" />
        <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-16">
      {/* 1. Header with Status & Breadcrumbs */}
      <AppointmentDetailHeader 
        status={mockAppointmentDetail.status} 
        type={mockAppointmentDetail.type}
        appointmentId={mockAppointmentDetail.id}
      />

      {/* 2. Core Info Grid (Patient, Schedule, Billing) */}
      <InfoGrid 
        doctor={mockAppointmentDetail.doctor}
        patient={mockAppointmentDetail.patient}
        schedule={mockAppointmentDetail.schedule}
        billing={mockAppointmentDetail.billing}
      />

      {/* 3. Clinical Outcomes (Only for completed) */}
      {mockAppointmentDetail.status === "completed" && (
        <section className="space-y-10">
          <div className="h-px bg-gray-100" />
          <ClinicalOutcome 
            diagnosis={mockAppointmentDetail.medical.diagnosis}
            notes={mockAppointmentDetail.medical.notes}
            prescriptions={mockAppointmentDetail.medical.prescriptions}
          />
        </section>
      )}

      {/* 4. Documents & Attachments */}
      <section className="space-y-10">
        <div className="h-px bg-gray-100" />
        <DocumentList documents={mockAppointmentDetail.documents} />
      </section>

      {/* 5. Footer Help Overlay */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-50 gap-6">
        <p className="text-sm text-gray-400 font-medium text-center md:text-left">
          Need help with this appointment? <span className="text-brand-dark font-bold underline cursor-pointer hover:text-brand-light transition-colors">Contact Support</span>
        </p>
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-dark transition-all">Digital Signature Secured</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
        </div>
      </div>
    </div>
  );
}
