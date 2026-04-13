import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { SendNotificationDto, NotificationType } from '@healio/shared-types';

@Injectable()
export class NotificationsService {
  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async handleNotification(dto: SendNotificationDto) {
    try {
      if (dto.recipientEmail) {
        const { subject, html } = this.emailService.getEmailContent(dto.type, dto.payload);
        await this.emailService.sendEmail(dto.recipientEmail, subject, html);
      }
      if (dto.recipientPhone) {
        const message = this.smsService.getSmsMessage(dto.type, dto.payload);
        await this.smsService.sendSms(dto.recipientPhone, message);
      }
    } catch (error) {
      console.error('Notification failed:', error);
    }
  }
}