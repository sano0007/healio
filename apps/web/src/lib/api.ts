const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const REFRESH_TOKEN_KEY = 'healio_refresh_token';

let authToken: string | null = null;
let refreshToken: string | null = null;

export function setAuthTokens(accessToken: string, refreshTokenValue?: string) {
  authToken = accessToken;
  if (refreshTokenValue) {
    refreshToken = refreshTokenValue;
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
    }
  }
}

export function clearAuthTokens() {
  authToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return authToken;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public body?: unknown,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);

    if (res.status === 401 && retry && refreshToken) {
      try {
        const refreshed = await request<AuthResponse>('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }, false);
        authToken = refreshed.access_token;
        refreshToken = refreshed.refresh_token || refreshToken;
        return request<T>(path, options, false);
      } catch {
        clearAuthTokens();
        throw new ApiError(401, 'UNAUTHORIZED', body);
      }
    }

    const message = body?.message || body?.error || res.statusText;
    throw new ApiError(res.status, message, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: { id: string; name: string; email: string; role: string };
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string; role: string; phone?: string }) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    refresh: (data: { refreshToken: string }) =>
      request<AuthResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify(data) }),
  },
  patients: {
    getMe: () => request<PatientProfile>('/patients/me'),
    updateMe: (data: Partial<PatientProfile>) =>
      request<PatientProfile>('/patients/me', { method: 'PATCH', body: JSON.stringify(data) }),
  },
  doctors: {
    getAll: () => request<Doctor[]>('/doctors'),
    getById: (id: string) => request<Doctor>(`/doctors/${id}`),
    updateMe: (data: Partial<DoctorProfile>) =>
      request<DoctorProfile>('/doctors/me', { method: 'PATCH', body: JSON.stringify(data) }),
    setAvailability: (availability: AvailabilitySlot[]) =>
      request<DoctorProfile>('/doctors/availability', { method: 'POST', body: JSON.stringify({ availability }) }),
    issuePrescription: (data: PrescriptionDto) =>
      request('/doctors/prescriptions', { method: 'POST', body: JSON.stringify(data) }),
  },
  appointments: {
    book: (data: { doctorId: string; scheduledAt: string; notes?: string }) =>
      request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    getMy: () => request<Appointment[]>('/appointments/my'),
    cancel: (id: string, reason: string) =>
      request(`/appointments/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
    updateStatus: (id: string, status: string) =>
      request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  payments: {
    initiate: (data: { appointmentId: string; amount: number; currency: string }) =>
      request<{ paymentId: string; clientSecret: string }>('/payments/initiate', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<Payment>(`/payments/${id}`),
  },
  admin: {
    getStats: () => request<AdminStats>('/admin/stats'),
    getPatients: () => request<PatientProfile[]>('/admin/patients'),
    getDoctors: () => request<Doctor[]>('/admin/doctors'),
    getAppointments: () => request<Appointment[]>('/admin/appointments'),
    getPayments: () => request<Payment[]>('/admin/payments'),
    verifyDoctor: (userId: string, isVerified: boolean) =>
      request<Doctor>(`/admin/doctors/${userId}/verify`, { method: 'PATCH', body: JSON.stringify({ isVerified }) }),
  },
  sessions: {
    create: (appointmentId: string) =>
      request<{ sessionId: string; jitsiUrl: string }>('/sessions', { method: 'POST', body: JSON.stringify({ appointmentId }) }),
    join: (sessionId: string) =>
      request<{ jitsiUrl: string }>('/sessions/join', { method: 'POST', body: JSON.stringify({ sessionId }) }),
  },
};

export interface PatientProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  address?: string;
}

export interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  specialty?: string;
  qualifications?: string;
  consultationFee?: number;
  isVerified?: boolean;
  availability?: AvailabilitySlot[];
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialty?: string;
  qualifications?: string;
  consultationFee?: number;
  isVerified?: boolean;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Payment {
  _id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingVerification: number;
  totalAppointments: number;
  appointmentsByStatus: { pending: number; confirmed: number; completed: number; cancelled: number };
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
}

export interface PrescriptionDto {
  patientId: string;
  appointmentId: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
}