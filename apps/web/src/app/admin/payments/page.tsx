'use client';

import { useState } from 'react';
import { usePayments, useExportToCSV } from '@/hooks/use-admin';
import { Download, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'pending', 'success', 'failed', 'refunded'];

export default function AdminPaymentsPage() {
  const [status, setStatus] = useState('all');
  
  const { data: payments, isLoading, refetch } = usePayments({ 
    status: status === 'all' ? undefined : status
  });
  
  const exportCSV = useExportToCSV<{
    _id: string; appointmentId: string; amount: number; currency: string; status: string
  }>(payments || [], `healio_payments_${new Date().toISOString().split('T')[0]}.csv`, [
    { key: '_id', header: 'Payment ID' },
    { key: 'appointmentId', header: 'Appointment ID' },
    { key: 'amount', header: 'Amount' },
    { key: 'currency', header: 'Currency' },
    { key: 'status', header: 'Status' },
  ]);

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    success: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-500',
    refunded: 'bg-gray-100 text-gray-500',
  };

  const revenue = payments?.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0) || 0;

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="h-7 w-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCSV()}
            disabled={!payments?.length}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${revenue.toLocaleString()}</div>
            <div className="text-xs text-gray-400">total revenue</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              status === s ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400'
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
              <th className="text-left px-5 py-3 font-medium text-gray-500">Payment ID</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Appointment</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Currency</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments?.map(payment => (
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
            {(!payments || payments.length === 0) && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}