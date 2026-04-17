"use client";

import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";

export interface DoctorFilters {
  search: string;
  specialty: string;
  availability: string;
  sort: string;
  page?: number;
  limit?: number;
}

const specialties = [
  "All Specialties",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "General Physician",
  "Orthopedics",
  "Psychiatry",
];

const availabilityOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "Next Week", value: "next-week" },
];

interface DoctorFilterProps {
  onFilterChange: (filters: DoctorFilters) => void;
}

export function DoctorFilter({ onFilterChange }: DoctorFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        specialty: selectedSpecialty,
        availability: selectedAvailability,
        sort,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedSpecialty, selectedAvailability, sort, onFilterChange]);

  function handleReset() {
    setSearch("");
    setSelectedSpecialty("All Specialties");
    setSelectedAvailability("");
    setSort("rating");
  }

  function toggleAvailability(value: string) {
    setSelectedAvailability(prev => prev === value ? "" : value);
  }

  return (
    <aside className="w-full lg:w-80 space-y-8 sticky top-24 self-start h-fit">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-dark transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name or keyword..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark transition-all placeholder:text-gray-400 text-sm shadow-sm"
        />
      </div>

      {/* Filter Sections */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-dark" />
            <h2 className="text-lg font-bold text-brand-black">Filters</h2>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs font-bold text-brand-dark hover:underline"
          >
            Reset
          </Link>
        </div>

        {/* Specialty */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-black uppercase tracking-widest flex items-center justify-between">
            Specialty
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </h3>
          <div className="flex flex-col gap-2">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
                  selectedSpecialty === spec 
                    ? "bg-brand-dark text-white" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                {spec}
                {selectedSpecialty === spec && <Check className="w-3 h-3" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-black uppercase tracking-widest">Availability</h3>
          <div className="space-y-3">
            {availabilityOptions.map((item) => (
              <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedAvailability === item.value}
                  onChange={() => toggleAvailability(item.value)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark/20 cursor-pointer" 
                />
                <span className="text-xs font-medium text-gray-500 group-hover:text-brand-dark transition-colors">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sorting */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand-black uppercase tracking-widest">Sort By</h3>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark transition-all cursor-pointer"
          >
            <option value="rating">Most Recommended</option>
            <option value="rating">Highest Rating</option>
            <option value="experience">Experience: High to Low</option>
            <option value="fee">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Promotion/Help Banner */}
      <div className="p-8 bg-brand-light/30 rounded-[2rem] border border-brand-light/20 shadow-sm overflow-hidden relative group">
        <div className="relative z-10">
          <h4 className="font-bold text-brand-dark mb-2">Need a recommendation?</h4>
          <p className="text-xs text-brand-dark/70 leading-relaxed mb-6">
            Describe your symptoms to our AI-powered assistant for a direct referral.
          </p>
          <Link href="/symptom-checker" className="block w-full py-3 bg-brand-dark text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-dark/10 hover:bg-brand-black transition-all group-hover:scale-[1.02] text-center">
            Ask Healio AI
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-dark/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand-dark/10 transition-colors" />
      </div>
    </aside>
  );
}