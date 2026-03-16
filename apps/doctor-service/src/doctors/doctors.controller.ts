import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { DoctorsService } from './doctors.service';

@Controller()
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @MessagePattern(MSG.DOCTOR_CREATE)
  createProfile(@Payload() data: { userId: string; name: string; email: string }) {
    return this.doctorsService.createProfile(data);
  }

  @MessagePattern(MSG.DOCTOR_GET_ALL)
  getAll() {
    return this.doctorsService.getAll();
  }

  @MessagePattern(MSG.DOCTOR_GET_ALL_ADMIN)
  getAllAdmin() {
    return this.doctorsService.getAllAdmin();
  }

  @MessagePattern(MSG.DOCTOR_GET)
  getById(@Payload() data: { userId: string }) {
    return this.doctorsService.getById(data.userId);
  }

  @MessagePattern(MSG.DOCTOR_UPDATE)
  update(@Payload() data: { userId: string; updates: Record<string, unknown> }) {
    return this.doctorsService.update(data.userId, data.updates as Record<string, unknown>);
  }

  @MessagePattern(MSG.DOCTOR_VERIFY)
  verify(@Payload() data: { userId: string; isVerified: boolean }) {
    return this.doctorsService.verify(data.userId, data.isVerified);
  }

  @MessagePattern(MSG.DOCTOR_SET_AVAILABILITY)
  setAvailability(@Payload() data: { userId: string; availability: unknown[] }) {
    return this.doctorsService.setAvailability(data.userId, data.availability);
  }
}