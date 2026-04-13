import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  specialty: string;

  @Prop({ type: [String] })
  qualifications: string[];

  @Prop()
  experience: number;

  @Prop()
  bio: string;

  @Prop({ default: 0 })
  consultationFee: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [{ dayOfWeek: Number, startTime: String, endTime: String, slotDurationMins: Number }] })
  availability: { dayOfWeek: number; startTime: string; endTime: string; slotDurationMins: number }[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);