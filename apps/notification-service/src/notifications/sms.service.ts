import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationType } from '@healio/shared-types';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiUrl = 'https://app.notify.lk/api/v1/send';

  constructor(private config: ConfigService) {}

  async sendSms(to: string, message: string): Promise<void> {
    const userId = this.config.get<string>('NOTIFY_LK_USER_ID');
    const apiKey = this.config.get<string>('NOTIFY_LK_API_KEY');
    const senderId = this.config.get<string>(
      'NOTIFY_LK_SENDER_ID',
      'NotifyDEMO',
    );

    if (!userId || !apiKey) {
      this.logger.warn('notify.lk credentials not configured — skipping SMS');
      return;
    }

    const params = new URLSearchParams({
      user_id: userId,
      api_key: apiKey,
      sender_id: senderId,
      to,
      message,
    });
    const res = await fetch(`${this.apiUrl}?${params.toString()}`);
    const body = await res.json().catch(() => ({}));

    if (!res.ok || (body as { status?: string }).status !== 'success') {
      throw new Error(`notify.lk error: ${JSON.stringify(body)}`);
    }

    this.logger.log(`SMS sent to ${to}`);
  }

  private fmt(raw: unknown): string {
    if (!raw) return 'N/A';
    const d = new Date(raw as string);
    if (isNaN(d.getTime())) return String(raw);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  getSmsMessage(
    type: NotificationType,
    role: 'patient' | 'doctor',
    payload: Record<string, unknown>,
  ): string {
    const date = this.fmt(payload.scheduledAt);
    const patient = (payload.patientName as string) ?? 'Patient';
    const doctor = (payload.doctorName as string) ?? 'Doctor';
    const amount = `${payload.amount} ${payload.currency}`;

    switch (type) {
      case NotificationType.APPOINTMENT_BOOKED:
        return role === 'patient'
          ? `Healio: Hi ${patient}, your appointment with Dr. ${doctor} has been requested for ${date}. You will be notified once the doctor confirms.`
          : `Healio: New appointment request from ${patient} for ${date}. Please log in to approve or reject.`;

      case NotificationType.PAYMENT_REQUESTED:
        return `Healio: Hi ${patient}, Dr. ${doctor} has approved your appointment on ${date}. Complete your payment of ${amount} to confirm your booking: ${payload.paymentUrl}`;

      case NotificationType.PAYMENT_SUCCESS:
        return role === 'patient'
          ? `Healio: Payment confirmed! Your appointment with Dr. ${doctor} on ${date} is now confirmed. See you then!`
          : `Healio: Payment of ${amount} received from ${patient}. Their appointment on ${date} is now confirmed.`;

      case NotificationType.APPOINTMENT_CONFIRMED:
        return role === 'patient'
          ? `Healio: Your appointment with Dr. ${doctor} on ${date} is confirmed.`
          : `Healio: You confirmed the appointment with ${patient} on ${date}.`;

      case NotificationType.APPOINTMENT_CANCELLED:
        return role === 'patient'
          ? `Healio: Your appointment with Dr. ${doctor} scheduled for ${date} has been cancelled.`
          : `Healio: The appointment with ${patient} scheduled for ${date} has been cancelled.`;

      case NotificationType.CONSULTATION_COMPLETED:
        return role === 'patient'
          ? `Healio: Your consultation with Dr. ${doctor} on ${date} is complete. Thank you for choosing Healio!`
          : `Healio: Consultation with ${patient} on ${date} marked as complete.`;

      default:
        return 'Healio: You have a new notification.';
    }
  }
}
