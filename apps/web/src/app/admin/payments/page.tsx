'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { api, Payment } from '@/lib/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  success: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-100 text-gray-500',
};

export default function AdminPaymentsPage() {
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.admin.getPayments().then(setPayments).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const revenue = payments.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-400">total revenue</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-500">Payment ID</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Appointment</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Currency</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map(payment => (
              <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{payment._id}</td>
                <td className="px-5 py-3 font-mono text-xs text-gray-500">{payment.appointmentId}</td>
                <td className="px-5 py-3 font-medium text-gray-900">${payment.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-500 uppercase">{payment.currency}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[payment.status] || 'bg-gray-100 text-gray-600'}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
