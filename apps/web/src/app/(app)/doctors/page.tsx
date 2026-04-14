"use client";

import { useState } from "react";
import { DoctorFilter, type DoctorFilters } from "@/components/doctors/doctor-filter";
import { DoctorList } from "@/components/doctors/doctor-list";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useDoctors } from "@/hooks/use-doctors";

export default function DoctorsPage() {
  const [filters, setFilters] = useState<DoctorFilters>({
    search: "",
    specialty: "All Specialties",
    availability: "",
    sort: "rating",
  });

  const { data: doctors, isLoading, error } = useDoctors(filters);

  function handleFilterChange(newFilters: DoctorFilters) {
    setFilters(newFilters);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
            <Link href="/dashboard" className="hover:text-brand-dark transition-colors flex items-center gap-1.5">
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-bold">Find Doctors</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-black tracking-tight">Our Specialists</h1>
          <p className="text-sm text-gray-500 mt-1 font-light leading-relaxed">
            Find and book appointments with top-rated medical experts in your area.
          </p>
        </div>

        {/* Results Counter (Desktop only) */}
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-bold text-brand-black uppercase tracking-widest leading-none mb-1">
            Available Doctors
          </p>
          <div className="flex items-center gap-2">
            {!isLoading && doctors && (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-2xl font-bold text-emerald-600">{doctors.length}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Filter Sidebar */}
        <DoctorFilter onFilterChange={handleFilterChange} />

        {/* Right Side: Results Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-brand-black">Showing Result</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-bold text-brand-dark">{doctors?.length || 0}</span> 
              doctors found for <span className="font-bold text-brand-dark italic">"{filters.specialty}"</span>
            </div>
          </div>

          <DoctorList 
            doctors={doctors || []} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </div>
    </div>
  );
}