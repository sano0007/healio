import { useQuery } from '@tanstack/react-query';
import { api, Doctor } from '@/lib/api';
import { useAuth } from '@/contexts/auth';

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  availability?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedDoctors {
  data: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => api.doctors.getAll(filters) as Promise<PaginatedDoctors>,
    staleTime: 1000 * 60,
  });
}

export function useDoctor(doctorId: string) {
  return useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => api.doctors.getById(doctorId) as Promise<Doctor>,
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDoctorProfile() {
  const { isLoading: authLoading } = useAuth();
  return useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => api.doctors.getMe() as Promise<Doctor>,
    enabled: !authLoading,
    staleTime: 1000 * 60 * 5,
  });
}
