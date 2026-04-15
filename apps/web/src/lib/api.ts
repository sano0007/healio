const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

function auth(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string; role: string }) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  patients: {
    getMe: (token: string) =>
      request<PatientProfile>('/patients/me', { headers: auth(token) }),
    updateMe: (token: string, data: Partial<PatientProfile>) =>
      request<PatientProfile>('/patients/me', {
        method: 'PATCH',
        headers: auth(token),
        body: JSON.stringify(data),
      }),
  },
  doctors: {
    getAll: (token: string) =>
      request<Doctor[]>('/doctors', { headers: auth(token) }),
    getById: (token: string, id: string) =>
      request<Doctor>(`/doctors/${id}`, { headers: auth(token) }),
    updateMe: (token: string, data: Partial<DoctorProfile>) =>
      request<DoctorProfile>('/doctors/me', {
        method: 'PATCH',
        headers: auth(token),
        body: JSON.stringify(data),
      }),
    setAvailability: (token: string, availability: AvailabilitySlot[]) =>
      request<DoctorProfile>('/doctors/availability', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify({ availability }),
      }),
    issuePrescription: (token: string, data: PrescriptionDto) =>
      request('/doctors/prescriptions', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify(data),
      }),
  },
  appointments: {
    book: (token: string, data: { doctorId: string; scheduledAt: string; notes?: string }) =>
      request<Appointment>('/appointments', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify(data),
      }),
    getMy: (token: string) =>
      request<Appointment[]>('/appointments/my', { headers: auth(token) }),
    cancel: (token: string, id: string, reason: string) =>
      request(`/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: auth(token),
        body: JSON.stringify({ reason }),
      }),
    updateStatus: (token: string, id: string, status: string) =>
      request(`/appointments/${id}/status`, {
        method: 'PATCH',
        headers: auth(token),
        body: JSON.stringify({ status }),
      }),
  },
  payments: {
    initiate: (token: string, data: { appointmentId: string; amount: number; currency: string }) =>
      request<{ paymentId: string; clientSecret: string }>('/payments/initiate', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify(data),
      }),
    get: (token: string, id: string) =>
      request<Payment>(`/payments/${id}`, { headers: auth(token) }),
  },
  admin: {
    getStats: (token: string) =>
      request<AdminStats>('/admin/stats', { headers: auth(token) }),
    getPatients: (token: string) =>
      request<PatientProfile[]>('/admin/patients', { headers: auth(token) }),
    getDoctors: (token: string) =>
      request<Doctor[]>('/admin/doctors', { headers: auth(token) }),
    getAppointments: (token: string) =>
      request<Appointment[]>('/admin/appointments', { headers: auth(token) }),
    getPayments: (token: string) =>
      request<Payment[]>('/admin/payments', { headers: auth(token) }),
    verifyDoctor: (token: string, userId: string, isVerified: boolean) =>
      request<Doctor>(`/admin/doctors/${userId}/verify`, {
        method: 'PATCH',
        headers: auth(token),
        body: JSON.stringify({ isVerified }),
      }),
  },
  sessions: {
    create: (token: string, appointmentId: string) =>
      request<{ sessionId: string; jitsiUrl: string }>('/sessions', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify({ appointmentId }),
      }),
    join: (token: string, sessionId: string) =>
      request<{ jitsiUrl: string }>('/sessions/join', {
        method: 'POST',
        headers: auth(token),
        body: JSON.stringify({ sessionId }),
      }),
  },
};

export interface AuthResponse {
  access_token: string;
  user: { id: string; name: string; email: string; role: string };
}

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
