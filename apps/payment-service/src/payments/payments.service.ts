import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import Stripe from 'stripe';
import { Payment, PaymentDocument } from './payment.schema';
import { InitiatePaymentDto } from '@healio/shared-types';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    });
  }

  async initiatePayment(dto: InitiatePaymentDto) {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: dto.currency || 'usd',
      metadata: { appointmentId: dto.appointmentId, patientId: dto.patientId },
    });

    const payment = new this.paymentModel({
      appointmentId: dto.appointmentId,
      patientId: dto.patientId,
      amount: dto.amount,
      currency: dto.currency || 'usd',
      stripePaymentIntentId: intent.id,
      stripeClientSecret: intent.client_secret,
      status: 'pending',
    });
    await payment.save();

    return { paymentId: payment._id.toString(), clientSecret: intent.client_secret };
  }

  async confirmPayment(stripePaymentIntentId: string) {
    const payment = await this.paymentModel.findOneAndUpdate(
      { stripePaymentIntentId },
      { status: 'success' },
      { new: true },
    ).exec();
    if (!payment) throw new RpcException('Payment not found');
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