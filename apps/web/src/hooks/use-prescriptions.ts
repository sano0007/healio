import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';

export function usePrescriptions() {
    return useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => api.prescriptions.getMy(),
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
