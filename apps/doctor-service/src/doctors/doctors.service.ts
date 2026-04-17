import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Doctor, DoctorDocument } from './doctor.schema';

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10 || !digits.startsWith('0')) {
    throw new RpcException(
      'Phone number must be 10 digits starting with 0 (e.g. 0771234567)',
    );
  }
  return '94' + digits.slice(1);
}

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async getAll(
    filters: {
      search?: string;
      specialty?: string;
      availability?: string;
      sort?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const query: any = { isVerified: true };

    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    if (filters.specialty && filters.specialty !== 'All Specialties') {
      query.specialty = filters.specialty;
    }

    let sortOption: any = { createdAt: -1 };
    if (filters.sort === 'rating') sortOption = { rating: -1, reviewCount: -1 };
    if (filters.sort === 'experience') sortOption = { experience: -1 };
    if (filters.sort === 'fee') sortOption = { consultationFee: 1 };

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      this.doctorModel
        .find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.doctorModel.countDocuments(query).exec(),
    ]);

    return {
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllAdmin() {
    return this.doctorModel
      .find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getById(userId: string) {
    let doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) {
      doctor = await this.doctorModel.create({
        userId,
        name: '',
        email: '',
        availability: [],
        status: 'online',
      });
    }
    if (!doctor.status) {
      doctor.status = 'online';
    }
    return doctor;
  }

  async update(userId: string, updates: Partial<Doctor>) {
    if (updates.phone) updates.phone = normalisePhone(updates.phone);
    let doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) {
      doctor = await this.doctorModel.create({
        userId,
        name: '',
        email: '',
        availability: [],
      });
    }
    doctor = await this.doctorModel
      .findOneAndUpdate({ userId }, updates, { new: true })
      .exec();
    if (!doctor) throw new RpcException('Doctor profile not found');
    return doctor;
  }

  async verify(userId: string, isVerified: boolean) {
    let doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) {
      doctor = await this.doctorModel.create({
        userId,
        name: '',
        email: '',
        availability: [],
      });
    }
    doctor = await this.doctorModel
      .findOneAndUpdate({ userId }, { isVerified }, { new: true })
      .exec();
    if (!doctor) throw new RpcException('Doctor profile not found');
    return doctor;
  }

  async setAvailability(userId: string, availability: unknown[]) {
    let doctor = await this.doctorModel.findOne({ userId }).exec();
    if (!doctor) {
      doctor = await this.doctorModel.create({
        userId,
        name: '',
        email: '',
        availability: [],
      });
    }
    doctor = await this.doctorModel
      .findOneAndUpdate({ userId }, { availability }, { new: true })
      .exec();
    if (!doctor) throw new RpcException('Doctor profile not found');
    return doctor;
  }

  async createProfile(data: Partial<Doctor>) {
    if (data.phone) data.phone = normalisePhone(data.phone);
    const doctor = new this.doctorModel(data);
    return doctor.save();
  }

  async updateStatus(userId: string, status: string) {
    const validStatuses = ['online', 'busy', 'offline'];
    if (!validStatuses.includes(status)) {
      throw new RpcException(
        'Invalid status. Must be online, busy, or offline',
      );
    }
    const doctor = await this.doctorModel
      .findOneAndUpdate({ userId }, { status }, { new: true })
      .exec();
    if (!doctor) throw new RpcException('Doctor profile not found');
    return doctor;
  }
}
