'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { api, Doctor } from '@/lib/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminDoctorsPage() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api.admin.getDoctors(token).then(setDoctors).finally(() => setLoading(false));
  }, [token]);

  async function toggleVerify(userId: string, current: boolean) {
    if (!token) return;
    setVerifying(userId);
    try {
      const updated = await api.admin.verifyDoctor(token, userId, !current);
      setDoctors(prev => prev.map(d => d._id === updated._id ? updated : d));
    } finally {
      setVerifying(null);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
        <span className="text-sm text-gray-500">{doctors.length} total</span>
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
            {doctors.map(doctor => (
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
                    disabled={verifying === doctor._id}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      doctor.isVerified
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                    }`}
                  >
                    {verifying === doctor._id ? '…' : doctor.isVerified ? 'Revoke' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No doctors registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
