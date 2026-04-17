import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  appointmentId: string;

  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'usd' })
  currency: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'success', 'failed', 'refunded'],
  })
  status: string;

  @Prop({ default: 'stripe' })
  provider: string;

  @Prop()
  stripePaymentIntentId: string;

  @Prop()
  stripeCheckoutSessionId: string;

  @Prop()
  stripeCheckoutUrl: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
