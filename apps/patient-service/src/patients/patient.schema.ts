import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  bloodGroup: string;

  @Prop()
  address: string;

  @Prop({ type: [{ filename: String, originalName: String, uploadedAt: Date, url: String }] })
  medicalReports: { filename: string; originalName: string; uploadedAt: Date; url: string }[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);