'use client';

import { useAdminStats, useAppointments, usePayments } from '@/hooks/use-admin';
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

const COLORS = {
  pending: '#f59e0b',
  confirmed: '#14b8a6',
  completed: '#22c55e',
  cancelled: '#ef4444',
  verified: '#22c55e',
  unverified: '#f59e0b',
};

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error, refetch } = useAdminStats();
  const { data: appointments } = useAppointments({});
  const { data: payments } = usePayments({});

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="text-gray-400">
        Failed to load stats.{' '}
        <button onClick={() => refetch()} className="text-teal-600 underline">
          Retry
        </button>
      </div>
    );
  if (!stats) return <div className="text-gray-400">Failed to load stats.</div>;

  const appointmentData = [
    { name: 'Pending', value: stats.appointmentsByStatus.pending },
    { name: 'Confirmed', value: stats.appointmentsByStatus.confirmed },
    { name: 'Completed', value: stats.appointmentsByStatus.completed },
    { name: 'Cancelled', value: stats.appointmentsByStatus.cancelled },
  ].filter((d) => d.value > 0);

  const doctorVerificationData = [
    { name: 'Verified', value: stats.verifiedDoctors },
    { name: 'Pending', value: stats.pendingVerification },
  ];

  const appointmentsByDay =
    appointments?.reduce((acc: Record<string, number>, apt) => {
      const day = new Date(apt.scheduledAt).toLocaleDateString('en-US', {
        weekday: 'short',
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {}) || {};

  const appointmentsChartData = Object.entries(appointmentsByDay).map(
    ([day, count]) => ({
      day,
      appointments: count,
    }),
  );

  const revenueByDay =
    payments
      ?.filter((p) => p.status === 'success')
      .reduce((acc: Record<string, number>, payment) => {
        const day = new Date().toLocaleDateString('en-US', {
          weekday: 'short',
        });
        acc[day] = (acc[day] || 0) + payment.amount;
        return acc;
      }, {}) || {};

  const revenueChartData = Object.entries(revenueByDay)
    .map(([day, amount]) => ({
      day,
      revenue: amount,
    }))
    .slice(-7);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Doctors"
          value={stats.totalDoctors}
          sub={`${stats.pendingVerification} pending verification`}
          icon={Stethoscope}
          color="bg-teal-50 text-teal-600"
        />
        <StatCard
          label="Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          sub={`${stats.successfulPayments} of ${stats.totalPayments} paid`}
          icon={TrendingUp}
          color="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Appointments by Status
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {appointmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Object.values(COLORS)[
                          index % Object.values(COLORS).length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Doctor Verification
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={doctorVerificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {doctorVerificationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.verified : COLORS.unverified}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Appointments This Week
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Bar
                  dataKey="appointments"
                  fill="#14b8a6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    'Revenue',
                  ]}
                />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
