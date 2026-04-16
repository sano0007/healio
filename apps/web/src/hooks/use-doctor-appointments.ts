import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, Appointment} from '@/lib/api';

export interface DoctorAppointment extends Appointment {
    patientName?: string;
}

export function useDoctorAppointments() {
    return useQuery({
        queryKey: ['doctor-appointments'],
        queryFn: () => api.appointments.getMy() as Promise<DoctorAppointment[]>,
        staleTime: 1000 * 60,
    });
}

export function useAcceptAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (appointmentId: string) => {
            await api.appointments.updateStatus(appointmentId, 'confirmed');
            return appointmentId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['doctor-appointments']});
        },
    });
}

export function useRejectAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (appointmentId: string) => {
            await api.appointments.updateStatus(appointmentId, 'cancelled');
            return appointmentId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['doctor-appointments']});
        },
    });
}
