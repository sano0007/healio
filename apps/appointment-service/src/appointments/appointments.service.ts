import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { BookAppointmentDto } from '@healio/shared-types';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

  async book(dto: BookAppointmentDto) {
    const appointment = new this.appointmentModel({
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      scheduledAt: new Date(dto.scheduledAt),
      notes: dto.notes,
      status: 'pending',
    });
    return appointment.save();
  }

  async cancel(appointmentId: string, reason?: string) {
    const appt = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: 'cancelled', cancellationReason: reason },
      { new: true },
    ).exec();
    if (!appt) throw new RpcException('Appointment not found');
    return appt;
  }

  async updateStatus(appointmentId: string, status: string, paymentStatus?: string) {
    const update: Record<string, string> = { status };
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const appt = await this.appointmentModel.findByIdAndUpdate(appointmentId, update, { new: true }).exec();
    if (!appt) throw new RpcException('Appointment not found');
    return appt;
  }

  async getById(appointmentId: string) {
    const appt = await this.appointmentModel.findById(appointmentId).exec();
    if (!appt) throw new RpcException('Appointment not found');
    return appt;
  }

  async getAll() {
    return this.appointmentModel.find().sort({ scheduledAt: -1 }).exec();
  }

  async getByPatient(patientId: string) {
    return this.appointmentModel.find({ patientId }).sort({ scheduledAt: -1 }).exec();
  }

  async getByDoctor(doctorId: string) {
    return this.appointmentModel.find({ doctorId }).sort({ scheduledAt: -1 }).exec();
  }
}