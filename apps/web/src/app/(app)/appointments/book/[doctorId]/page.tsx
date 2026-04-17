"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {BookingStepper} from "@/components/appointments/booking/booking-stepper";
import {BookingSummarySidebar} from "@/components/appointments/booking/booking-summary-sidebar";
import {PatientInfoStep} from "@/components/appointments/booking/steps/patient-info-step";
import {ConsultationDetailsStep} from "@/components/appointments/booking/steps/consultation-details-step";
import {PaymentStep} from "@/components/appointments/booking/steps/payment-step";
import {SuccessState} from "@/components/appointments/booking/success-state";
import {AnimatePresence} from "framer-motion";
import {useDoctor} from "@/hooks/use-doctors";
import {useBookAppointment} from "@/hooks/use-appointments";
import {Skeleton} from "@/components/ui/skeleton";

interface BookingData {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  reason?: string;
  selectedDate?: string;
  selectedTime?: string;
}

export default function AppointmentBookingPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const { data: doctor, isLoading: isLoadingDoctor } = useDoctor(doctorId);
  const bookAppointment = useBookAppointment();

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    const time = params.get('time');
    if (date && time) {
      setBookingData(prev => ({...prev, selectedDate: date, selectedTime: decodeURIComponent(time)}));
    }
  }, []);

  useEffect(() => {
    if (!doctorId && !isLoadingDoctor) {
      router.push("/doctors");
    }
  }, [doctorId, isLoadingDoctor, router]);

  const handleNext = (data: any) => {
    setBookingData({ ...bookingData, ...data });
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handlePaymentComplete = async () => {
    try {
      const selectedDateStr = bookingData.selectedDate;
      const selectedTimeStr = bookingData.selectedTime;
      
      let scheduledAt: string;

      if (selectedDateStr && selectedTimeStr) {
        const hasSlash = selectedDateStr.includes('/');
        let year: number, month: number, day: number, hours: number, minutes: number;

        if (hasSlash) {
          const dateParts = selectedDateStr.split('/').map(Number);
          const timeParts = selectedTimeStr.split(':').map(Number);
          const isPM = selectedTimeStr.toLowerCase().includes('pm') && timeParts[0] !== 12;
          year = dateParts[2];
          month = dateParts[0] - 1;
          day = dateParts[1];
          hours = timeParts[0] + (isPM ? 12 : 0);
          minutes = timeParts[1];
        } else {
          const [y, m, d] = selectedDateStr.split('-').map(Number);
          const timeParts = selectedTimeStr.split(':');
          const isPM = selectedTimeStr.toLowerCase().includes('pm');
          let hourNum = parseInt(timeParts[0], 10);
          if (isPM && hourNum !== 12) hourNum += 12;
          if (!isPM && hourNum === 12) hourNum = 0;
          year = y;
          month = m - 1;
          day = d;
          hours = hourNum;
          minutes = parseInt(timeParts[1], 10);
        }

        // Format as ISO string without timezone conversion
        scheduledAt = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      } else {
        scheduledAt = new Date().toISOString();
      }
      
      const result = await bookAppointment.mutateAsync({
        doctorId,
        scheduledAt,
        notes: bookingData.reason,
      });
      setBookedAppointment(result);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  if (bookedAppointment) {
    const scheduleDate = new Date(bookedAppointment.scheduledAt);
    return (
      <SuccessState 
        appointmentId={bookedAppointment._id} 
        date={scheduleDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        time={scheduleDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
      />
    );
  }

  if (isLoadingDoctor) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-8">
        <Skeleton className="h-12 w-64 mx-auto rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 text-center">
        <p className="text-gray-500">Doctor not found</p>
      </div>
    );
  }

  const formatDisplayDate = (date: string | undefined): string => {
    if (!date) return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const dateParts = date.split('/').map(Number);
    return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDisplayTime = (time: string | undefined) => {
    if (!time) return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return time;
  };

  const doctorDisplay = {
    name: doctor.name,
    specialization: doctor.specialty || "General Physician",
    image: "/images/doctor-placeholder.png",
    fee: doctor.consultationFee || 0,
  };

  const details = {
    date: formatDisplayDate(bookingData.selectedDate),
    time: formatDisplayTime(bookingData.selectedTime),
    type: "video" as const,
  };

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
              <PaymentStep 
                key="step3" 
                onComplete={handlePaymentComplete} 
                onBack={handleBack} 
                data={bookingData} 
                isLoading={bookAppointment.isPending}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="order-first lg:order-last">
          <BookingSummarySidebar 
            doctor={doctorDisplay} 
            details={details} 
          />
        </div>
      </div>
    </div>
  );
}
