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
      from: `Healio <${this.config.get('SMTP_FROM') || 'noreply@healio.app'}>`,
      to,
      subject,
      html,
    });
  }

  private fmt(raw: unknown): string {
    if (!raw) return 'N/A';
    const d = new Date(raw as string);
    if (isNaN(d.getTime())) return String(raw);
    return d.toLocaleString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  private wrap(title: string, body: string): string {
    return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
  <div style="background:#2563eb;padding:28px 32px;">
    <h1 style="margin:0;color:#fff;font-size:22px;">Healio</h1>
    <p style="margin:4px 0 0;color:#bfdbfe;font-size:13px;">Healthcare at your fingertips</p>
  </div>
  <div style="padding:32px;">
    <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;">${title}</h2>
    ${body}
  </div>
  <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">This is an automated message from Healio. Please do not reply to this email.</p>
  </div>
</div></body></html>`;
  }

  private row(label: string, value: string): string {
    return `<tr>
      <td style="padding:8px 0;color:#64748b;font-size:14px;width:140px;">${label}</td>
      <td style="padding:8px 0;color:#1e293b;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
  }

  private table(rows: string): string {
    return `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}</table>`;
  }

  private btn(text: string, url: string): string {
    return `<a href="${url}" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;">${text}</a>`;
  }

  getEmailContent(
    type: NotificationType,
    role: 'patient' | 'doctor',
    payload: Record<string, unknown>,
  ) {
    const date = this.fmt(payload.scheduledAt);
    const patient = (payload.patientName as string) ?? 'Patient';
    const doctor = (payload.doctorName as string) ?? 'Doctor';
    const specialty = payload.doctorSpecialty as string;
    const amount = `${payload.amount} ${payload.currency}`;
    const notes = payload.notes as string;

    switch (type) {
      // ─── Appointment Booked ─────────────────────────────────────────────────
      case NotificationType.APPOINTMENT_BOOKED:
        if (role === 'patient') {
          return {
            subject: 'Appointment Request Submitted — Healio',
            html: this.wrap(
              'Your Appointment Request',
              `
              <p style="color:#475569;font-size:15px;">Hi <strong>${patient}</strong>, your appointment request has been submitted. The doctor will review and confirm shortly.</p>
              ${this.table(
                this.row(
                  'Doctor',
                  `Dr. ${doctor}${specialty ? ` (${specialty})` : ''}`,
                ) +
                  this.row('Date &amp; Time', date) +
                  (notes ? this.row('Notes', notes) : ''),
              )}
              <p style="color:#64748b;font-size:13px;margin-top:16px;">You will receive another notification once Dr. ${doctor} approves your appointment.</p>
            `,
            ),
          };
        }
        return {
          subject: `New Appointment Request from ${patient} — Healio`,
          html: this.wrap(
            'New Appointment Request',
            `
            <p style="color:#475569;font-size:15px;">You have a new appointment request. Please review and confirm or reject.</p>
            ${this.table(
              this.row('Patient', patient) +
                this.row('Requested Date', date) +
                (notes ? this.row('Notes', notes) : ''),
            )}
            <p style="color:#64748b;font-size:13px;margin-top:16px;">Log in to your Healio dashboard to approve or reject this appointment.</p>
          `,
          ),
        };

      // ─── Payment Requested ──────────────────────────────────────────────────
      case NotificationType.PAYMENT_REQUESTED:
        return {
          subject: `Action Required: Complete Payment for Your Appointment — Healio`,
          html: this.wrap(
            'Payment Required to Confirm Your Booking',
            `
            <p style="color:#475569;font-size:15px;">Hi <strong>${patient}</strong>, Dr. <strong>${doctor}</strong> has approved your appointment! Complete your payment to confirm the booking.</p>
            ${this.table(
              this.row(
                'Doctor',
                `Dr. ${doctor}${specialty ? ` (${specialty})` : ''}`,
              ) +
                this.row('Date &amp; Time', date) +
                this.row('Amount Due', amount),
            )}
            ${this.btn('Pay Now', payload.paymentUrl as string)}
            <p style="color:#94a3b8;font-size:12px;margin-top:16px;">If the button doesn't work, copy this link into your browser:<br/><span style="word-break:break-all;">${payload.paymentUrl}</span></p>
            <p style="color:#ef4444;font-size:13px;margin-top:8px;">⚠ Your booking is not confirmed until payment is completed.</p>
          `,
          ),
        };

      // ─── Payment Success ─────────────────────────────────────────────────────
      case NotificationType.PAYMENT_SUCCESS:
        if (role === 'patient') {
          return {
            subject: 'Booking Confirmed — Payment Successful ✓ — Healio',
            html: this.wrap(
              'Your Booking is Confirmed!',
              `
              <p style="color:#475569;font-size:15px;">Hi <strong>${patient}</strong>, your payment was successful and your appointment is now confirmed.</p>
              ${this.table(
                this.row(
                  'Doctor',
                  `Dr. ${doctor}${specialty ? ` (${specialty})` : ''}`,
                ) +
                  this.row('Date &amp; Time', date) +
                  this.row('Amount Paid', amount),
              )}
              <p style="color:#16a34a;font-size:14px;margin-top:12px;">✓ Your appointment is confirmed. See you soon!</p>
            `,
            ),
          };
        }
        return {
          subject: `Payment Received from ${patient} — Healio`,
          html: this.wrap(
            'Payment Received',
            `
            <p style="color:#475569;font-size:15px;">Payment has been received from <strong>${patient}</strong>. The appointment is now confirmed.</p>
            ${this.table(
              this.row('Patient', patient) +
                this.row('Date &amp; Time', date) +
                this.row('Amount', amount),
            )}
          `,
          ),
        };

      // ─── Appointment Cancelled ──────────────────────────────────────────────
      case NotificationType.APPOINTMENT_CANCELLED:
        if (role === 'patient') {
          return {
            subject: 'Appointment Cancelled — Healio',
            html: this.wrap(
              'Your Appointment Has Been Cancelled',
              `
              <p style="color:#475569;font-size:15px;">Hi <strong>${patient}</strong>, your appointment has been cancelled.</p>
              ${this.table(
                this.row('Doctor', `Dr. ${doctor}`) +
                  this.row('Scheduled Date', date),
              )}
              <p style="color:#64748b;font-size:13px;margin-top:16px;">You can book a new appointment at any time through Healio.</p>
            `,
            ),
          };
        }
        return {
          subject: `Appointment Cancelled — ${patient} — Healio`,
          html: this.wrap(
            'Appointment Cancelled',
            `
            <p style="color:#475569;font-size:15px;">The appointment with <strong>${patient}</strong> has been cancelled.</p>
            ${this.table(
              this.row('Patient', patient) + this.row('Scheduled Date', date),
            )}
          `,
          ),
        };

      // ─── Consultation Completed ─────────────────────────────────────────────
      case NotificationType.CONSULTATION_COMPLETED:
        if (role === 'patient') {
          return {
            subject: 'Consultation Complete — Thank You — Healio',
            html: this.wrap(
              'Your Consultation is Complete',
              `
              <p style="color:#475569;font-size:15px;">Hi <strong>${patient}</strong>, your consultation has been completed. Thank you for choosing Healio.</p>
              ${this.table(
                this.row('Doctor', `Dr. ${doctor}`) + this.row('Date', date),
              )}
              <p style="color:#64748b;font-size:13px;margin-top:16px;">If you were prescribed any medications, please check your prescription in the Healio app.</p>
            `,
            ),
          };
        }
        return {
          subject: `Consultation Completed — ${patient} — Healio`,
          html: this.wrap(
            'Consultation Marked as Complete',
            `
            <p style="color:#475569;font-size:15px;">The consultation with <strong>${patient}</strong> has been marked as complete.</p>
            ${this.table(this.row('Patient', patient) + this.row('Date', date))}
          `,
          ),
        };

      default:
        return {
          subject: 'Healio Notification',
          html: this.wrap(
            'Notification',
            '<p>You have a new notification from Healio.</p>',
          ),
        };
    }
  }
}
