'use client';

import { useState } from 'react';
import { type DoctorFilters } from '@/components/doctors/doctor-filter';
import { DoctorList } from '@/components/doctors/doctor-list';
import { ChevronFirst, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useDoctors } from '@/hooks/use-doctors';

export default function DoctorsPage() {
  const [filters, setFilters] = useState<DoctorFilters>({
    search: '',
    specialty: 'All Specialties',
    availability: '',
    sort: 'rating',
    page: 1,
    limit: 10,
  });

  const { data: response, isLoading, error } = useDoctors(filters);
  const doctors = response?.data || [];
  const pagination = response?.pagination;

  function handleFilterChange(newFilters: DoctorFilters) {
    setFilters({ ...newFilters, page: 1 });
  }

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
            <Link
              href="/dashboard"
              className="hover:text-brand-dark transition-colors flex items-center gap-1.5"
            >
              <Home className="w-3 h-3" />
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-bold">Find Doctors</span>
          </div>
          <h1 className="text-3xl font-bold text-brand-black tracking-tight">
            Our Specialists
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-light leading-relaxed">
            Find and book appointments with top-rated medical experts in your
            area.
          </p>
        </div>

        {/* Results Counter (Desktop only) */}
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-bold text-brand-black uppercase tracking-widest leading-none mb-1">
            Available Doctors
          </p>
          <div className="flex items-center gap-2">
            {!isLoading && pagination && (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-2xl font-bold text-emerald-600">
                  {pagination.total}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Right Side: Results Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-brand-black">
              Showing Result
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {pagination && (
                <>
                  <span className="font-bold text-brand-dark">
                    {pagination.total}
                  </span>
                  doctors found{filterLabel()}
                </>
              )}
            </div>
          </div>

          <DoctorList doctors={doctors} isLoading={isLoading} error={error} />

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-8">
              <button
                onClick={() => goToPage(1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronFirst className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1,
                  )
                  .map((pageNum, idx, arr) => (
                    <span key={pageNum}>
                      {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-brand-dark text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    </span>
                  ))}
              </div>

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function filterLabel() {
    if (filters.specialty && filters.specialty !== 'All Specialties') {
      return ` for "${filters.specialty}"`;
    }
    if (filters.search) {
      return ` matching "${filters.search}"`;
    }
    return '';
  }
}
