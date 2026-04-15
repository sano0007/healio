import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, AdminStats, PatientProfile, Doctor, Appointment, Payment } from '@/lib/api';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PatientFilters extends PaginationParams {
  search?: string;
}

export interface DoctorFilters extends PaginationParams {
  search?: string;
  specialty?: string;
  isVerified?: boolean;
}

export interface AppointmentFilters extends PaginationParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentFilters extends PaginationParams {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.admin.getStats() as Promise<AdminStats>,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function usePatients(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'patients', filters],
    queryFn: () => api.admin.getPatients(filters) as Promise<PatientProfile[]>,
    staleTime: 60000,
  });
}

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'doctors', filters],
    queryFn: () => api.admin.getDoctors(filters) as Promise<Doctor[]>,
    staleTime: 60000,
  });
}

export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'appointments', filters],
    queryFn: () => api.admin.getAppointments(filters) as Promise<Appointment[]>,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}

export function usePayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'payments', filters],
    queryFn: () => api.admin.getPayments(filters) as Promise<Payment[]>,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useVerifyDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isVerified }: { userId: string; isVerified: boolean }) => {
      const result = await api.admin.verifyDoctor(userId, isVerified);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useRefreshAdminData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  };
}

export function useExportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[]
) {
  return () => {
    const headers = columns.map(c => c.header).join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const value = row[col.key as keyof T];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value ?? '';
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
}