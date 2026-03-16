import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Doctor, DoctorDocument } from './doctor.schema';

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
    const doctor = new this.doctorModel(data);
    return doctor.save();
  }
}