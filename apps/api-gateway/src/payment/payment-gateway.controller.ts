import { Controller, Post, Get, Body, Param, UseGuards, Request, Req, Headers, HttpCode, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MSG, NotificationType } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe');
import type { RawBodyRequest } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';

@Controller('payments')
export class PaymentGatewayController {
  private stripe: any;

  constructor(
    @Inject('PAYMENT_SERVICE')      private paymentClient: ClientProxy,
    @Inject('PATIENT_SERVICE')      private patientClient: ClientProxy,
    @Inject('DOCTOR_SERVICE')       private doctorClient: ClientProxy,
    @Inject('APPOINTMENT_SERVICE')  private apptClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
    private config: ConfigService,
  ) {
    this.stripe = new StripeLib(this.config.get('STRIPE_SECRET_KEY', ''));
  }

  // ─── Stripe Webhook (no JWT — called by Stripe) ───────────────────────────
  @Post('webhook')
  @HttpCode(200)
  async stripeWebhook(
    @Req() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') sig: string,
  ) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new BadRequestException('Stripe webhook secret not configured');
    }

    let event: any;
    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody!, sig, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const appointmentId = session.metadata?.appointmentId;
      const checkoutSessionId = session.id;

      if (appointmentId && session.payment_status === 'paid') {
        await this.handlePaymentSuccess(checkoutSessionId, appointmentId);
      }
    }

    return { received: true };
  }

  // ─── Manual complete (dev fallback) ──────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async complete(
    @Body() body: { checkoutSessionId: string; appointmentId: string },
  ) {
    await this.handlePaymentSuccess(body.checkoutSessionId, body.appointmentId);
    return { success: true };
  }

  // ─── Shared payment success handler ──────────────────────────────────────
  private async handlePaymentSuccess(checkoutSessionId: string, appointmentId: string) {
    // Confirm payment record in payment service
    const payment = await firstValueFrom(
      this.paymentClient.send(MSG.PAYMENT_CONFIRM, { checkoutSessionId }),
    );

    // Flip appointment to confirmed + mark payment paid
    await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_UPDATE_STATUS, {
        appointmentId,
        status: 'confirmed',
        paymentStatus: 'paid',
      }),
    );

    // Notify patient + doctor (fire-and-forget)
    this.emitPaymentSuccessNotification(appointmentId, payment).catch(() => {});
  }

  private async emitPaymentSuccessNotification(
    appointmentId: string,
    payment: { amount?: number; currency?: string; patientId?: string },
  ) {
    const appointment = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_GET, { appointmentId }),
    ).catch(() => null);

    const patientId = payment.patientId ?? appointment?.patientId;
    if (!patientId) return;

    const [patient, doctor] = await Promise.all([
      firstValueFrom(this.patientClient.send(MSG.PATIENT_GET, { userId: patientId })).catch(() => null),
      appointment?.doctorId
        ? firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: appointment.doctorId })).catch(() => null)
        : Promise.resolve(null),
    ]);

    const payload = {
      amount: payment.amount,
      currency: (payment.currency ?? 'usd').toUpperCase(),
      appointmentId,
      scheduledAt: appointment?.scheduledAt,
      patientName: patient?.name ?? 'Patient',
      doctorName: doctor?.name ?? 'Doctor',
    };

    if (patient?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type: NotificationType.PAYMENT_SUCCESS,
        recipientRole: 'patient',
        recipientEmail: patient.email,
        recipientPhone: patient.phone ?? undefined,
        payload,
      });
    }
    if (doctor?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type: NotificationType.PAYMENT_SUCCESS,
        recipientRole: 'doctor',
        recipientEmail: doctor.email,
        recipientPhone: doctor.phone ?? undefined,
        payload,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPayment(@Param('id') id: string) {
    return firstValueFrom(this.paymentClient.send(MSG.PAYMENT_GET, { paymentId: id }));
  }
}
