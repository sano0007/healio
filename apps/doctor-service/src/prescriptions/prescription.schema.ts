import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  appointmentId: string;

  @Prop({
    type: [
      { name: String, dosage: String, frequency: String, duration: String },
    ],
  })
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];

  @Prop()
  notes: string;

  @Prop({ default: Date.now })
  issuedAt: Date;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
