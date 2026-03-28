import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Doctor, DoctorDocument } from './doctor.schema';

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10 || !digits.startsWith('0')) {
    throw new RpcException('Phone number must be 10 digits starting with 0 (e.g. 0771234567)');
  }
  return '94' + digits.slice(1);
}

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async getAll() {
    return this.doctorModel.find({ isVerified: true }).exec();
  }

  async getAllAdmin() {
    return this.doctorModel.find().select('-__v').sort({ createdAt: -1 }).exec();
  }

  async getById(userId: string) {
    const doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) throw new RpcException('Doctor not found');
    return doctor;
  }

  async update(userId: string, updates: Partial<Doctor>) {
    const { isVerified: _, ...safeUpdates } = updates as Doctor & { isVerified?: boolean };
    if (safeUpdates.phone) safeUpdates.phone = normalisePhone(safeUpdates.phone);
    const doctor = await this.doctorModel.findOneAndUpdate({ userId }, safeUpdates, { new: true }).exec();
    if (!doctor) throw new RpcException('Doctor not found');
    return doctor;
  }

  async verify(userId: string, isVerified: boolean) {
    const doctor = await this.doctorModel.findOneAndUpdate({ userId }, { isVerified }, { new: true }).exec();
    if (!doctor) throw new RpcException('Doctor not found');
    return doctor;
  }

  async setAvailability(userId: string, availability: unknown[]) {
    const doctor = await this.doctorModel.findOneAndUpdate(
      { userId },
      { availability },
      { new: true },
    ).exec();
    if (!doctor) throw new RpcException('Doctor not found');
    return doctor;
  }

  async createProfile(data: Partial<Doctor>) {
    if (data.phone) data.phone = normalisePhone(data.phone);
    const doctor = new this.doctorModel(data);
    return doctor.save();
  }
}