import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getAccessToken } from '@/lib/api';

export interface MedicalRecord {
  filename: string;
  originalName: string;
  url: string;
  uploadedAt: string;
}

export function useRecords() {
  return useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const patient = await api.patients.getMe();
      return (patient.medicalReports || []).map((r, idx) => ({
        id: r.filename || `record-${idx}`,
        title: r.originalName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        type: inferType(r.originalName),
        date: new Date(r.uploadedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        doctor: 'Uploaded by Patient',
        status: 'verified' as const,
        size: 'Unknown',
        url: r.url,
        filename: r.filename,
      }));
    },
    staleTime: 1000 * 60,
  });
}

function inferType(
  filename: string,
): 'lab' | 'imaging' | 'prescription' | 'note' {
  const lower = filename.toLowerCase();
  if (
    lower.includes('x-ray') ||
    lower.includes('mri') ||
    lower.includes('scan') ||
    lower.includes('ct')
  )
    return 'imaging';
  if (
    lower.includes('prescription') ||
    lower.includes('rx') ||
    lower.includes('script')
  )
    return 'prescription';
  if (
    lower.includes('lab') ||
    lower.includes('blood') ||
    lower.includes('test') ||
    lower.includes('report')
  )
    return 'lab';
  return 'note';
}

export function useUploadRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/patients/me/reports`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
}
