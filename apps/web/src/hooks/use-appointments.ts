import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, Appointment, Doctor} from '@/lib/api';

export interface AppointmentWithDoctor extends Appointment {
  doctor?: Doctor;
}

export function useAppointments() {
    return useQuery<AppointmentWithDoctor[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
        const result = await api.appointments.getMy();
        const appointments: Appointment[] = Array.isArray(result) ? result : [];

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
      if (!data.doctorId) {
        throw new Error('Doctor ID is required');
      }

        if (!data.scheduledAt) {
        throw new Error('Scheduled date and time is required');
      }

      const [datePart, timePart] = data.scheduledAt.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);
      const scheduledDate = new Date(year, month - 1, day, hour, minute, second);
      const now = new Date();
      if (
          scheduledDate.getFullYear() < now.getFullYear() ||
          (scheduledDate.getFullYear() === now.getFullYear() && scheduledDate.getMonth() < now.getMonth()) ||
          (scheduledDate.getFullYear() === now.getFullYear() && scheduledDate.getMonth() === now.getMonth() && scheduledDate.getDate() < now.getDate()) ||
          (scheduledDate.getFullYear() === now.getFullYear() && scheduledDate.getMonth() === now.getMonth() && scheduledDate.getDate() === now.getDate() && scheduledDate.getHours() < now.getHours()) ||
          (scheduledDate.getFullYear() === now.getFullYear() && scheduledDate.getMonth() === now.getMonth() && scheduledDate.getDate() === now.getDate() && scheduledDate.getHours() === now.getHours() && scheduledDate.getMinutes() < now.getMinutes())
      ) {
        throw new Error('Cannot book appointments in the past');
      }

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
