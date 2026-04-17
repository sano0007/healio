import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PatientDocument = Patient & Document;

const MedicalReportSchema = new MongooseSchema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  bloodGroup: string;

  @Prop()
  address: string;

  @Prop({ type: [MedicalReportSchema], default: [] })
  medicalReports: {
    filename: string;
    originalName: string;
    url: string;
    uploadedAt: Date;
  }[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
