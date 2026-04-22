import {useQuery} from '@tanstack/react-query';
import {api, Prescription} from '@/lib/api';

export function usePrescriptions() {
    return useQuery<Prescription[] | null>({
        queryKey: ['prescriptions'],
        queryFn: async () => {
            try {
                const result = await api.prescriptions.getMy();
                console.log('Prescriptions response:', result);
                if (!result) return null;
                if (Array.isArray(result)) return result;
                if (result && typeof result === 'object' && 'data' in result) {
                    const data = (result as any).data;
                    return Array.isArray(data) ? data : null;
                }
                return null;
            } catch (error) {
                console.error('Failed to fetch prescriptions:', error);
                return null;
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}

export function usePrescriptionById(id: string | undefined) {
    return useQuery({
        queryKey: ['prescription', id],
        queryFn: () => id ? api.prescriptions.getById(id) : Promise.resolve(null),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function usePrescriptionByAppointment(appointmentId: string | undefined) {
    return useQuery({
        queryKey: ['prescription', 'appointment', appointmentId],
        queryFn: () => appointmentId ? api.prescriptions.getByAppointment(appointmentId) : Promise.resolve(null),
        enabled: !!appointmentId,
        staleTime: 1000 * 60 * 5,
    });
}
