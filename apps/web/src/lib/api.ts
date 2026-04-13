const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('healio_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Doctors ─────────────────────────────────────────────────────────────────

export const doctors = {
  getAll: () => request('/doctors'),
  getById: (id: string) => request(`/doctors/${id}`),
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointments = {
  book: (data: { doctorId: string; scheduledAt: string; notes?: string }) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getMine: () => request('/appointments/my'),
  cancel: (id: string) => request(`/appointments/${id}/cancel`, { method: 'PATCH' }),
};

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patients = {
  getProfile: () => request('/patients/me'),
  updateProfile: (updates: Record<string, unknown>) =>
    request('/patients/me', { method: 'PATCH', body: JSON.stringify(updates) }),
};

// ─── Sessions (Telemedicine) ─────────────────────────────────────────────────

export const sessions = {
  create: (appointmentId: string) =>
    request('/sessions', { method: 'POST', body: JSON.stringify({ appointmentId }) }),
  join: (sessionId: string) =>
    request('/sessions/join', { method: 'POST', body: JSON.stringify({ sessionId }) }),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments = {
  initiate: (data: { appointmentId: string; amount: number; currency: string }) =>
    request('/payments/initiate', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => request(`/payments/${id}`),
};