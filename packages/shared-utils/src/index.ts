import { ApiResponse } from '@healio/shared-types';

// ─── Response Helpers ─────────────────────────────────────────────────────────

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function fail(error: string): ApiResponse<never> {
  return { success: false, error };
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function isValidFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date > new Date();
}

// ─── String Helpers ───────────────────────────────────────────────────────────

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
