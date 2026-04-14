import { useQuery } from '@tanstack/react-query';
import { api, Doctor } from '@/lib/api';

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  availability?: string;
  sort?: string;
}

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => api.doctors.getAll(filters) as Promise<Doctor[]>,
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