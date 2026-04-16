import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api, PatientProfile} from '@/lib/api';

export function usePatient() {
    return useQuery({
        queryKey: ['patient'],
        queryFn: () => api.patients.getMe(),
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdatePatient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<PatientProfile>) => {
            return api.patients.updateMe(data);
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['patient'], updated);
            queryClient.invalidateQueries({queryKey: ['patient']});
        },
    });
}
