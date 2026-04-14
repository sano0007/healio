'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { api, Appointment } from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-teal-50 text-teal-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-500',
};

export default function AdminAppointmentsPage() {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) return;
    api.admin.getAppointments().then(setAppointments).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <span className="text-sm text-gray-500">{appointments.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === s ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Patient ID</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Doctor ID</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Scheduled</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(appt => (
              <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{appt.patientId}</td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{appt.doctorId}</td>
                <td className="px-5 py-3 text-gray-700">{new Date(appt.scheduledAt).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                    {appt.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{appt.notes || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
