import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Appointment, Doctor } from '@/lib/api';

export interface AppointmentWithDoctor extends Appointment {
  doctor?: Doctor;
}

export function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const appointments = await api.appointments.getMy();
      
      const uniqueDoctorIds = [...new Set(appointments.map(apt => apt.doctorId))];
      
      const doctorResults = await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          try {
            return { doctorId, doctor: await api.doctors.getById(doctorId) };
          } catch {
            return { doctorId, doctor: undefined };
          }
        })
      );

      const doctorMap = new Map(doctorResults.map(r => [r.doctorId, r.doctor]));

      const enrichedAppointments: AppointmentWithDoctor[] = appointments.map(apt => ({
        ...apt,
        doctor: doctorMap.get(apt.doctorId),
      }));

      return enrichedAppointments;
    },
    staleTime: 1000 * 60,
  });
}

interface BookAppointmentInput {
  doctorId: string;
  scheduledAt: string;
  notes?: string;
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BookAppointmentInput) => {
      const result = await api.appointments.book(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      await api.appointments.cancel(id, reason);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}