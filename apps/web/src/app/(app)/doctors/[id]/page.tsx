'use client';

import { useDoctor } from '@/hooks/use-doctors';
import { DoctorProfileHeader } from '@/components/doctors/profile/doctor-profile-header';
import { DoctorStatsGrid } from '@/components/doctors/profile/doctor-stats-grid';
import { DoctorDetails } from '@/components/doctors/profile/doctor-details';
import { DoctorReviews } from '@/components/doctors/profile/doctor-reviews';
import { BookingWidget } from '@/components/doctors/profile/booking-widget';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = params.id as string;
  const { data: doctor, isLoading, error } = useDoctor(doctorId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto space-y-10">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-bold text-brand-black mb-2">
            Doctor not found
          </h3>
          <p className="text-sm text-gray-400">
            We couldn't load the doctor profile. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const experience = doctor.experience || 0;
  const rating = doctor.rating || 0;
  const reviewCount = doctor.reviewCount || 0;
  const fee = doctor.consultationFee || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* 1. Back Link & Header */}
      <div className="px-2">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>
        <DoctorProfileHeader
          name={doctor.name}
          specialization={doctor.specialty || 'General Physician'}
          image="/images/doctor-1.png"
          rating={rating}
          reviews={reviewCount}
          location="Medical Center"
          isVerified={doctor.isVerified}
        />
      </div>

      {/* 2. Main Split Content */}
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Info Feed */}
        <div className="lg:col-span-2 space-y-10">
          <DoctorStatsGrid
            patients={`${experience * 50}+`}
            experience={experience}
            rating={rating}
            reviews={reviewCount}
          />
          <DoctorDetails
            bio={doctor.bio || 'No bio available.'}
            specialties={doctor.specialty ? [doctor.specialty] : []}
            education={
              doctor.qualifications?.map((q, i) => ({
                id: String(i),
                year: '',
                title: q,
                subtitle: '',
              })) || []
            }
            experience={[]}
          />
          <DoctorReviews reviews={[]} />
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="relative">
          <BookingWidget fee={fee} doctorId={doctor.userId || doctor._id} />
        </div>
      </div>
    </div>
  );
}
