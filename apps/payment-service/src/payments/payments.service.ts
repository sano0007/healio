import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import Stripe from 'stripe';
import { Payment, PaymentDocument } from './payment.schema';
import { InitiatePaymentDto } from '@healio/shared-types';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY', ''), {
      apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    });
  }

  async initiatePayment(dto: InitiatePaymentDto) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: dto.currency || 'usd',
            unit_amount: Math.round(dto.amount * 100),
            product_data: {
              name: `Healio — Consultation with Dr. ${dto.doctorName ?? 'Doctor'}`,
              description: `Appointment ID: ${dto.appointmentId}`,
            },
          },
        },
      ],
      metadata: { appointmentId: dto.appointmentId, patientId: dto.patientId },
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
    });

    const payment = new this.paymentModel({
      appointmentId: dto.appointmentId,
      patientId: dto.patientId,
      amount: dto.amount,
      currency: dto.currency || 'usd',
      stripeCheckoutSessionId: session.id,
      stripeCheckoutUrl: session.url,
      status: 'pending',
    });
    await payment.save();

    return { paymentId: payment._id.toString(), checkoutUrl: session.url };
  }

  async confirmPayment(checkoutSessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(checkoutSessionId);
    if (session.payment_status !== 'paid') {
      throw new RpcException('Payment has not been completed');
    }

    const payment = await this.paymentModel.findOneAndUpdate(
      { stripeCheckoutSessionId: checkoutSessionId },
      { status: 'success', stripePaymentIntentId: session.payment_intent as string },
      { new: true },
    ).exec();
    if (!payment) throw new RpcException('Payment record not found');
    return payment;
  }

  async getPayment(paymentId: string) {
    const payment = await this.paymentModel.findById(paymentId).exec();
    if (!payment) throw new RpcException('Payment not found');
    return payment;
  }

  async getAll() {
    return this.paymentModel.find().sort({ createdAt: -1 }).exec();
  }
}