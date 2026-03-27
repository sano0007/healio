import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ default: 'pending', enum: ['pending', 'awaiting_payment', 'confirmed', 'cancelled', 'completed'] })
  status: string;

  @Prop()
  notes: string;

  @Prop()
  cancellationReason: string;

  @Prop({ default: 'unpaid' })
  paymentStatus: string;

  @Prop()
  sessionId: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);