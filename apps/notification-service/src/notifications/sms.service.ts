import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { NotificationType } from '@healio/shared-types';

@Injectable()
export class SmsService {
  private client: ReturnType<typeof Twilio>;

  constructor(private config: ConfigService) {
    this.client = Twilio(
      this.config.get('TWILIO_ACCOUNT_SID'),
      this.config.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(to: string, message: string) {
    await this.client.messages.create({
      body: message,
      from: this.config.get('TWILIO_PHONE_NUMBER'),
      to,
    });
  }

  getSmsMessage(type: NotificationType, payload: Record<string, unknown>): string {
    switch (type) {
      case NotificationType.APPOINTMENT_BOOKED:
        return `Healio: Your appointment has been booked for ${payload.scheduledAt}.`;
      case NotificationType.APPOINTMENT_CONFIRMED:
        return `Healio: Your appointment on ${payload.scheduledAt} is confirmed.`;
      case NotificationType.APPOINTMENT_CANCELLED:
        return `Healio: Your appointment has been cancelled.`;
      case NotificationType.PAYMENT_SUCCESS:
        return `Healio: Payment of ${payload.amount} ${payload.currency} successful.`;
      default:
        return 'Healio: You have a new notification.';
    }
  }
}