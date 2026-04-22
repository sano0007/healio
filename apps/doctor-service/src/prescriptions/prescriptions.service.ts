import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Prescription, PrescriptionDocument } from './prescription.schema';

@Injectable()
export class PrescriptionsService {
  constructor(@InjectModel(Prescription.name) private prescriptionModel: Model<PrescriptionDocument>) {}

  async issuePrescription(data: Partial<Prescription>) {
    if (!data.patientId) {
      throw new RpcException('Prescription validation failed: patientId: Path `patientId` is required.');
    }
    if (!data.doctorId) {
      throw new RpcException('Prescription validation failed: doctorId: Path `doctorId` is required.');
    }
    if (!data.appointmentId) {
      throw new RpcException('Prescription validation failed: appointmentId: Path `appointmentId` is required.');
    }
    const prescription = new this.prescriptionModel(data);
    return prescription.save();
  }

  async getByDoctor(doctorId: string) {
    return this.prescriptionModel.find({ doctorId }).sort({ issuedAt: -1 }).exec();
  }

  async getByPatient(patientId: string) {
    return this.prescriptionModel.find({ patientId }).sort({ issuedAt: -1 }).exec();
  }

  async getByAppointment(appointmentId: string) {
    return this.prescriptionModel.findOne({ appointmentId }).exec();
  }

  async getById(prescriptionId: string) {
    return this.prescriptionModel.findById(prescriptionId).exec();
  }
}