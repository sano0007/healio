"use client";

import { useState, useEffect } from "react";
import { DoctorProfileHeader } from "@/components/doctors/profile/doctor-profile-header";
import { DoctorStatsGrid } from "@/components/doctors/profile/doctor-stats-grid";
import { DoctorDetails } from "@/components/doctors/profile/doctor-details";
import { DoctorReviews } from "@/components/doctors/profile/doctor-reviews";
import { BookingWidget } from "@/components/doctors/profile/booking-widget";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const mockDoctor = {
  id: "1",
  name: "Dr. Sarah Johnson",
  specialization: "Senior Cardiologist",
  image: "/images/doctor-1.png",
  rating: 4.9,
  reviews: 124,
  location: "Medical Center, New York, NY",
  patients: "500+",
  experience: 12,
  fee: 150,
  bio: "Dr. Sarah Johnson is a highly experienced cardiologist with over 12 years of practice. She specializes in non-invasive cardiology and has helped thousands of patients manage heart conditions through personalized care and advanced diagnostics. Her patient-first approach and dedication to clinical excellence have earned her numerous awards in the field of cardiovascular medicine.",
  specialties: ["Non-Invasive Cardiology", "Heart Failure", "Echocardiography", "Preventative Care", "Hypertension"],
  education: [
    { id: "e1", year: "2008 - 2012", title: "Doctor of Medicine", subtitle: "Harvard Medical School" },
    { id: "e2", year: "2012 - 2015", title: "Residency in Internal Medicine", subtitle: "Johns Hopkins Hospital" },
  ],
  experienceList: [
    { id: "x1", year: "2015 - 2020", title: "Cardiologist", subtitle: "Cleveland Clinic" },
    { id: "x2", year: "2020 - Present", title: "Senior Cardiologist", subtitle: "New York Presbyterian" },
  ],
  reviewList: [
    {
      id: "r1",
      patientName: "Robert Fox",
      patientImage: "/images/avatar-1.png",
      rating: 5,
      date: "2 days ago",
      comment: "Dr. Sarah is incredibly thorough and professional. She took the time to explain everything clearly and made me feel very comfortable throughout the consultation.",
      isVerified: true
    },
    {
      id: "r2",
      patientName: "Jenny Wilson",
      patientImage: "/images/avatar-2.png",
      rating: 4.8,
      date: "1 week ago",
      comment: "Highly recommend! The booking process was seamless and the video consultation was very effective. Her advice has already made a huge difference in my health.",
      isVerified: true
    }
  ]
};

export default function DoctorProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* 1. Back Link & Header */}
      <div className="px-2">
        <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </Link>
        <DoctorProfileHeader 
          name={mockDoctor.name}
          specialization={mockDoctor.specialization}
          image={mockDoctor.image}
          rating={mockDoctor.rating}
          reviews={mockDoctor.reviews}
          location={mockDoctor.location}
        />
      </div>

      {/* 2. Main Split Content */}
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Info Feed */}
        <div className="lg:col-span-2 space-y-10">
          <DoctorStatsGrid 
            patients={mockDoctor.patients}
            experience={mockDoctor.experience}
            rating={mockDoctor.rating}
            reviews={mockDoctor.reviews}
          />
          <DoctorDetails 
            bio={mockDoctor.bio}
            specialties={mockDoctor.specialties}
            education={mockDoctor.education}
            experience={mockDoctor.experienceList}
          />
          <DoctorReviews reviews={mockDoctor.reviewList} />
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="relative">
          <BookingWidget fee={mockDoctor.fee} />
        </div>
      </div>
    </div>
  );
}
