'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { api, PatientProfile } from '@/lib/api';

export default function AdminPatientsPage() {
  const { isAuthenticated } = useAuth();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.admin.getPatients().then(setPatients).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <span className="text-sm text-gray-500">{patients.length} total</span>
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
            {patients.map(patient => (
              <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{patient.name}</td>
                <td className="px-5 py-3 text-gray-500">{patient.email}</td>
                <td className="px-5 py-3 text-gray-600">{patient.phone || '—'}</td>
                <td className="px-5 py-3 text-gray-600">{patient.bloodGroup || '—'}</td>
                <td className="px-5 py-3 text-gray-600">{patient.address || '—'}</td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No patients registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
