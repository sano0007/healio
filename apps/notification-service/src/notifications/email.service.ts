import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationType } from '@healio/shared-types';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT') || 587,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM') || 'noreply@healio.app',
      to,
      subject,
      html,
    });
  }

  getEmailContent(type: NotificationType, payload: Record<string, unknown>) {
    switch (type) {
      case NotificationType.APPOINTMENT_BOOKED:
        return { subject: 'Appointment Booked - Healio', html: `<h2>Appointment Booked</h2><p>Your appointment has been booked for ${payload.scheduledAt}.</p>` };
      case NotificationType.APPOINTMENT_CONFIRMED:
        return { subject: 'Appointment Confirmed - Healio', html: `<h2>Appointment Confirmed</h2><p>Your appointment on ${payload.scheduledAt} is confirmed.</p>` };
      case NotificationType.APPOINTMENT_CANCELLED:
        return { subject: 'Appointment Cancelled - Healio', html: `<h2>Appointment Cancelled</h2><p>Your appointment on ${payload.scheduledAt} has been cancelled.</p>` };
      case NotificationType.CONSULTATION_COMPLETED:
        return { subject: 'Consultation Completed - Healio', html: `<h2>Consultation Completed</h2><p>Your telemedicine consultation has been completed.</p>` };
      case NotificationType.PAYMENT_SUCCESS:
        return { subject: 'Payment Successful - Healio', html: `<h2>Payment Successful</h2><p>Your payment of ${payload.amount} ${payload.currency} was successful.</p>` };
      default:
        return { subject: 'Healio Notification', html: '<p>You have a new notification from Healio.</p>' };
    }
  }
}