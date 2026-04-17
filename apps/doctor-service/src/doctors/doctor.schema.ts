import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MongooseSchema} from 'mongoose';

export type DoctorDocument = Doctor & Document;

const AvailabilitySlotSchema = new MongooseSchema(
  {
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  specialty: string;

  @Prop({ type: [String] })
  qualifications: string[];

  @Prop()
  experience: number;

  @Prop()
  bio: string;

  @Prop({ default: 0 })
  consultationFee: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: "online" })
  status: string;

  @Prop({ type: [AvailabilitySlotSchema], default: [] })
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.set('toJSON', {
  transform: (_doc, ret) => {
    if (Array.isArray(ret.availability)) {
      ret.availability = ret.availability.map((s: { dayOfWeek: number; startTime: string; endTime: string }) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }));
    }
    return ret;
  },
});