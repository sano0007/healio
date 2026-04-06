"use client";

import { motion } from "framer-motion";
import { DoctorCard, type Doctor } from "./doctor-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope } from "lucide-react";

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    image: "/images/doctor-1.png",
    experience: 12,
    rating: 4.9,
    reviews: 120,
    fee: 150,
    nextAvailable: "Today, 10:30 AM",
    isVerified: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Dermatologist",
    image: "/images/doctor-2.png",
    experience: 8,
    rating: 4.8,
    reviews: 85,
    fee: 120,
    nextAvailable: "Tomorrow, 02:15 PM",
    isVerified: true,
  },
  {
    id: "3",
    name: "Dr. Emily Wilson",
    specialization: "General Physician",
    image: "/images/doctor-3.png",
    experience: 15,
    rating: 5.0,
    reviews: 210,
    fee: 100,
    nextAvailable: "Wednesday, 09:00 AM",
    isVerified: true,
  },
  {
    id: "4",
    name: "Dr. James Miller",
    specialization: "Pediatrician",
    image: "/images/doctor-1.png",
    experience: 10,
    rating: 4.7,
    reviews: 95,
    fee: 130,
    nextAvailable: "Today, 04:30 PM",
    isVerified: false,
  },
  {
    id: "5",
    name: "Dr. Robert Garcia",
    specialization: "Neurologist",
    image: "/images/doctor-2.png",
    experience: 20,
    rating: 4.9,
    reviews: 150,
    fee: 200,
    nextAvailable: "Thursday, 11:15 AM",
    isVerified: true,
  },
  {
    id: "6",
    name: "Dr. Linda Taylor",
    specialization: "Psychiatrist",
    image: "/images/doctor-3.png",
    experience: 14,
    rating: 4.8,
    reviews: 110,
    fee: 180,
    nextAvailable: "Monday, 10:00 AM",
    isVerified: true,
  },
];

export function DoctorList({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[280px] bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-3 w-1/4 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
          <Stethoscope className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">No doctors found</h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          We couldn't find any specialist matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
