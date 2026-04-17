import {useQuery} from '@tanstack/react-query';
import {api, Prescription} from '@/lib/api';

export function usePrescriptions() {
    return useQuery<Prescription[]>({
        queryKey: ['prescriptions'],
        queryFn: async () => {
            const result = await api.prescriptions.getMy();
            // Handle wrapped response format: { data: [...] } or plain array
            if (Array.isArray(result)) return result;
            if (result && typeof result === 'object' && 'data' in result) {
                const data = (result as any).data;
                return Array.isArray(data) ? data : [];
            }
            return [];
        },
        staleTime: 1000 * 60 * 5,
    });
}
