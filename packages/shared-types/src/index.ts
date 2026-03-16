// ─── Enums ────────────────────────────────────────────────────────────────────

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum NotificationType {
  APPOINTMENT_BOOKED = 'appointment_booked',
  APPOINTMENT_CONFIRMED = 'appointment_confirmed',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  CONSULTATION_COMPLETED = 'consultation_completed',
  PAYMENT_SUCCESS = 'payment_success',
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Common Response ──────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Message Patterns (TCP inter-service) ─────────────────────────────────────

export const MSG = {
  // Auth Service
  AUTH_REGISTER: 'auth.register',
  AUTH_LOGIN: 'auth.login',
  AUTH_VALIDATE: 'auth.validate',

  // Patient Service
  PATIENT_CREATE: 'patient.create',
  PATIENT_GET: 'patient.get',
  PATIENT_GET_ALL: 'patient.get_all',
  PATIENT_UPDATE: 'patient.update',
  PATIENT_UPLOAD_REPORT: 'patient.upload_report',
  PATIENT_GET_HISTORY: 'patient.get_history',

  // Doctor Service
  DOCTOR_CREATE: 'doctor.create',
  DOCTOR_VERIFY: 'doctor.verify',
  DOCTOR_GET: 'doctor.get',
  DOCTOR_UPDATE: 'doctor.update',
  DOCTOR_SET_AVAILABILITY: 'doctor.set_availability',
  DOCTOR_GET_ALL: 'doctor.get_all',
  DOCTOR_GET_ALL_ADMIN: 'doctor.get_all_admin',
  DOCTOR_ISSUE_PRESCRIPTION: 'doctor.issue_prescription',
  DOCTOR_GET_PRESCRIPTIONS: 'doctor.get_prescriptions',

  // Appointment Service
  APPOINTMENT_GET_ALL: 'appointment.get_all',
  APPOINTMENT_BOOK: 'appointment.book',
  APPOINTMENT_CANCEL: 'appointment.cancel',
  APPOINTMENT_UPDATE_STATUS: 'appointment.update_status',
  APPOINTMENT_GET: 'appointment.get',
  APPOINTMENT_GET_BY_PATIENT: 'appointment.get_by_patient',
  APPOINTMENT_GET_BY_DOCTOR: 'appointment.get_by_doctor',

  // Telemedicine Service
  TELE_CREATE_SESSION: 'tele.create_session',
  TELE_JOIN_SESSION: 'tele.join_session',
  TELE_END_SESSION: 'tele.end_session',

  // Payment Service
  PAYMENT_INITIATE: 'payment.initiate',
  PAYMENT_CONFIRM: 'payment.confirm',
  PAYMENT_GET: 'payment.get',
  PAYMENT_GET_ALL: 'payment.get_all',

  // Notification Service
  NOTIFY_SEND: 'notify.send',
} as const;

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface BookAppointmentDto {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  notes?: string;
}

export interface SendNotificationDto {
  type: NotificationType;
  recipientEmail: string;
  recipientPhone?: string;
  payload: Record<string, unknown>;
}

export interface InitiatePaymentDto {
  appointmentId: string;
  patientId: string;
  amount: number;
  currency: string;
}
