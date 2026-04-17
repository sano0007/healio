import {useQuery} from '@tanstack/react-query';
import {api} from '@/lib/api';

export function usePrescriptions() {
    return useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => api.prescriptions.getMy(),
        staleTime: 1000 * 60 * 5,
    });
}
