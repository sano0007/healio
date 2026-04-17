import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {RpcException} from '@nestjs/microservices';
import {Patient, PatientDocument} from './patient.schema';

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10 || !digits.startsWith('0')) {
    throw new RpcException('Phone number must be 10 digits starting with 0 (e.g. 0771234567)');
  }
  return '94' + digits.slice(1);
}

@Injectable()
export class PatientsService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async getProfile(userId: string) {
    let patient = await this.patientModel.findOne({userId}).exec();
    if (!patient) {
      patient = await this.patientModel.create({userId, name: '', email: '', medicalReports: []});
    }
    return patient;
  }

  async updateProfile(userId: string, updates: Partial<Patient>) {
    if (updates.phone) updates.phone = normalisePhone(updates.phone);
    let patient = await this.patientModel.findOne({userId}).exec();
    if (!patient) {
      patient = await this.patientModel.create({userId, name: '', email: '', medicalReports: []});
    }
    patient = await this.patientModel.findOneAndUpdate({userId}, updates, {new: true}).exec();
    if (!patient) throw new RpcException('Patient profile not found');
    return patient;
  }

  async uploadReport(userId: string, report: { filename: string; originalName: string; url: string }) {
    let patient = await this.patientModel.findOne({userId}).exec();
    if (!patient) {
      patient = await this.patientModel.create({userId, name: '', email: '', medicalReports: []});
    }
    patient = await this.patientModel.findOneAndUpdate(
      { userId },
      { $push: { medicalReports: { ...report, uploadedAt: new Date() } } },
      { new: true },
    ).exec();
    return patient;
  }

  async getHistory(userId: string) {
    let patient = await this.patientModel.findOne({userId}).exec();
    if (!patient) {
      patient = await this.patientModel.create({userId, name: '', email: '', medicalReports: []});
    }
    return patient.medicalReports;
  }

  async getAll() {
    return this.patientModel.find().select('-__v').sort({ createdAt: -1 }).exec();
  }

  async createProfile(data: Partial<Patient>) {
    if (data.phone) data.phone = normalisePhone(data.phone);
    const patient = new this.patientModel(data);
    return patient.save();
  }
}