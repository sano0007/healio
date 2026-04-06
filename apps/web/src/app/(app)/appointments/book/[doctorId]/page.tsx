"use client";

import { useState } from "react";
import { BookingStepper } from "@/components/appointments/booking/booking-stepper";
import { BookingSummarySidebar } from "@/components/appointments/booking/booking-summary-sidebar";
import { PatientInfoStep } from "@/components/appointments/booking/steps/patient-info-step";
import { ConsultationDetailsStep } from "@/components/appointments/booking/steps/consultation-details-step";
import { PaymentStep } from "@/components/appointments/booking/steps/payment-step";
import { SuccessState } from "@/components/appointments/booking/success-state";
import { motion, AnimatePresence } from "framer-motion";

const mockDoctor = {
  name: "Dr. Sarah Johnson",
  specialization: "Senior Cardiologist",
  image: "/images/doctor-1.png",
  fee: 150,
};

const mockDetails = {
  date: "Tuesday, July 7, 2026",
  time: "09:30 AM",
  type: "video" as const,
};

export default function AppointmentBookingPage() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = (data: any) => {
    setBookingData({ ...bookingData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  if (isSuccess) {
    return (
      <SuccessState 
        appointmentId="HL-98231-A" 
        date={mockDetails.date} 
        time={mockDetails.time} 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12">
      {/* 1. Header & Stepper */}
      <div className="px-4 mb-12">
        <h1 className="text-3xl font-bold text-brand-black mb-10 text-center">Book Your Appointment</h1>
        <div className="max-w-xl mx-auto">
          <BookingStepper currentStep={step} />
        </div>
      </div>

      {/* 2. Main Split Content */}
      <div className="grid lg:grid-cols-3 gap-12 px-4 items-start">
        {/* Left Column: Flow Components */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[600px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <PatientInfoStep key="step1" onNext={handleNext} />
            )}
            {step === 2 && (
              <ConsultationDetailsStep key="step2" onNext={handleNext} onBack={handleBack} />
            )}
            {step === 3 && (
              <PaymentStep key="step3" onComplete={() => setIsSuccess(true)} onBack={handleBack} data={bookingData} />
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="order-first lg:order-last">
          <BookingSummarySidebar 
            doctor={mockDoctor} 
            details={mockDetails} 
          />
        </div>
      </div>
    </div>
  );
}
