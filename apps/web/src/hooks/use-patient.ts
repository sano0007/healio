import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {api, PatientProfile} from '@/lib/api';

export function usePatient() {
    return useQuery({
        queryKey: ['patient'],
        queryFn: () => api.patients.getMe(),
        staleTime: 1000 * 60 * 5,
    });
}

export function usePatientById(patientId: string | undefined) {
    return useQuery({
        queryKey: ['patient', patientId],
        queryFn: async () => {
            if (!patientId) return null;
            const patients = await api.admin.getPatients({ limit: 100 });
            return patients.find(p => p._id === patientId) ?? null;
        },
        enabled: !!patientId,
        staleTime: 1000 * 60 * 5,
    });
}

export function usePatientsList() {
    return useQuery({
        queryKey: ['patients', 'list'],
        queryFn: () => api.admin.getPatients({ limit: 100 }),
        staleTime: 1000 * 60 * 5,
    });
}

export function usePatientsLookup() {
    const {data: patients, ...rest} = usePatientsList();
    
    return {
        ...rest,
        patients,
        getPatientById: (patientId: string): PatientProfile | undefined => {
            return patients?.find(p => p._id === patientId);
        },
    };
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
