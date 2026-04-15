'use client';

import { useState, useEffect } from 'react';
import { usePatients, useExportToCSV } from '@/hooks/use-admin';
import { Search, Download } from 'lucide-react';

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { data: patients, isLoading, error, refetch } = usePatients({ search: debouncedSearch });
  
  const exportCSV = useExportToCSV<{
    _id: string; name: string; email: string; phone?: string; bloodGroup?: string; address?: string
  }>(patients || [], `healio_patients_${new Date().toISOString().split('T')[0]}.csv`, [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'bloodGroup', header: 'Blood Group' },
    { key: 'address', header: 'Address' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV()}
            disabled={!patients?.length}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <span className="text-sm text-gray-500">{patients?.length || 0} total</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Blood Group</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients?.map(patient => (
              <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{patient.name}</td>
                <td className="px-5 py-3 text-gray-500">{patient.email}</td>
                <td className="px-5 py-3 text-gray-600">{patient.phone || '—'}</td>
                <td className="px-5 py-3 text-gray-600">{patient.bloodGroup || '—'}</td>
                <td className="px-5 py-3 text-gray-600">{patient.address || '—'}</td>
              </tr>
            ))}
            {(!patients || patients.length === 0) && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No patients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
