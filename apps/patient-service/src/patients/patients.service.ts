import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Patient, PatientDocument } from './patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async getProfile(userId: string) {
    const patient = await this.patientModel.findOne({ userId }).exec();
    if (!patient) throw new RpcException('Patient profile not found');
    return patient;
  }

  async updateProfile(userId: string, updates: Partial<Patient>) {
    const patient = await this.patientModel.findOneAndUpdate({ userId }, updates, { new: true }).exec();
    if (!patient) throw new RpcException('Patient profile not found');
    return patient;
  }

  async uploadReport(userId: string, report: { filename: string; originalName: string; url: string }) {
    const patient = await this.patientModel.findOneAndUpdate(
      { userId },
      { $push: { medicalReports: { ...report, uploadedAt: new Date() } } },
      { new: true },
    ).exec();
    if (!patient) throw new RpcException('Patient profile not found');
    return patient;
  }

  async getHistory(userId: string) {
    const patient = await this.patientModel.findOne({ userId }, { medicalReports: 1 }).exec();
    if (!patient) throw new RpcException('Patient profile not found');
    return patient.medicalReports;
  }

  async createProfile(data: Partial<Patient>) {
    const patient = new this.patientModel(data);
    return patient.save();
  }
}