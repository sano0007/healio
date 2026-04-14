'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { api, AdminStats } from '@/lib/api';
import { Users, Stethoscope, Calendar, CreditCard, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.admin.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!stats) return <div className="text-gray-400">Failed to load stats.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard
          label="Doctors"
          value={stats.totalDoctors}
          sub={`${stats.pendingVerification} pending verification`}
          icon={Stethoscope}
          color="bg-teal-50 text-teal-600"
        />
        <StatCard label="Appointments" value={stats.totalAppointments} icon={Calendar} color="bg-purple-50 text-purple-600" />
        <StatCard
          label="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          sub={`${stats.successfulPayments} of ${stats.totalPayments} paid`}
          icon={TrendingUp}
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Appointments by Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats.appointmentsByStatus.pending, icon: Clock, color: 'text-yellow-500' },
              { label: 'Confirmed', value: stats.appointmentsByStatus.confirmed, icon: CheckCircle, color: 'text-teal-500' },
              { label: 'Completed', value: stats.appointmentsByStatus.completed, icon: CheckCircle, color: 'text-green-500' },
              { label: 'Cancelled', value: stats.appointmentsByStatus.cancelled, icon: XCircle, color: 'text-red-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor verification */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Doctor Verification</h2>
          <div className="space-y-3">
            {[
              { label: 'Verified', value: stats.verifiedDoctors, icon: CheckCircle, color: 'text-green-500' },
              { label: 'Pending Verification', value: stats.pendingVerification, icon: Clock, color: 'text-yellow-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Verification rate</span>
                <span>{stats.totalDoctors ? Math.round((stats.verifiedDoctors / stats.totalDoctors) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${stats.totalDoctors ? (stats.verifiedDoctors / stats.totalDoctors) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
