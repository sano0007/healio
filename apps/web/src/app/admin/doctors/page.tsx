'use client';

import { useState, useEffect } from 'react';
import { useDoctors, useVerifyDoctor, useExportToCSV } from '@/hooks/use-admin';
import { Search, Download, CheckCircle, Clock } from 'lucide-react';

const SPECIALTIES = ['Cardiology', 'Dermatology', 'General Physician', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Other'];

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { data: doctors, isLoading, refetch } = useDoctors({ 
    search: debouncedSearch, 
    specialty: specialty || undefined,
    isVerified: verified
  });
  
  const verifyDoctor = useVerifyDoctor();
  
  const exportCSV = useExportToCSV<{
    _id: string; name: string; email: string; specialty?: string; consultationFee?: number; isVerified?: boolean
  }>(doctors || [], `healio_doctors_${new Date().toISOString().split('T')[0]}.csv`, [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'specialty', header: 'Specialty' },
    { key: 'consultationFee', header: 'Consultation Fee' },
    { key: 'isVerified', header: 'Verified' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function toggleVerify(userId: string, current: boolean) {
    try {
      await verifyDoctor.mutateAsync({ userId, isVerified: !current });
    } catch (err) {
      console.error('Failed to verify doctor:', err);
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV()}
            disabled={!doctors?.length}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <span className="text-sm text-gray-500">{doctors?.length || 0} total</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={verified === undefined ? '' : verified.toString()}
          onChange={(e) => setVerified(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="true">Verified</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Specialty</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Fee</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {doctors?.map(doctor => (
              <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{doctor.name}</td>
                <td className="px-5 py-3 text-gray-500">{doctor.email}</td>
                <td className="px-5 py-3 text-gray-600">{doctor.specialty || <span className="text-gray-300 italic">Not set</span>}</td>
                <td className="px-5 py-3 text-gray-600">{doctor.consultationFee ? `$${doctor.consultationFee}` : '—'}</td>
                <td className="px-5 py-3">
                  {doctor.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleVerify(doctor._id, !!doctor.isVerified)}
                    disabled={verifyDoctor.isPending}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      doctor.isVerified
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    {verifyDoctor.isPending ? '…' : doctor.isVerified ? 'Revoke' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
            {(!doctors || doctors.length === 0) && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No doctors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}