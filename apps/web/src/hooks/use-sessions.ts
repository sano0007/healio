import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface CreateSessionResponse {
  sessionId: string;
  roomName: string;
  token?: string;
  roomSid?: string;
  twilioRoomSid?: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  roomName: string;
  roomSid?: string;
  token?: string;
  twilioRoomSid?: string;
  status: string;
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const result = await api.sessions.create(appointmentId);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

export function useJoinSession(sessionId: string) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => api.sessions.join(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const result = await api.sessions.end(sessionId);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}
