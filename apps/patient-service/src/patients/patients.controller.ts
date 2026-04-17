import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { PatientsService } from './patients.service';

@Controller()
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @MessagePattern(MSG.PATIENT_GET_ALL)
  getAll() {
    return this.patientsService.getAll();
  }

  @MessagePattern(MSG.PATIENT_CREATE)
  createProfile(
    @Payload() data: { userId: string; name: string; email: string },
  ) {
    return this.patientsService.createProfile(data);
  }

  @MessagePattern(MSG.PATIENT_GET)
  getProfile(@Payload() data: { userId: string }) {
    return this.patientsService.getProfile(data.userId);
  }

  @MessagePattern(MSG.PATIENT_UPDATE)
  updateProfile(
    @Payload() data: { userId: string; updates: Record<string, unknown> },
  ) {
    return this.patientsService.updateProfile(
      data.userId,
      data.updates as Record<string, unknown>,
    );
  }

  @MessagePattern(MSG.PATIENT_UPLOAD_REPORT)
  uploadReport(
    @Payload()
    data: {
      userId: string;
      report: { filename: string; originalName: string; url: string };
    },
  ) {
    return this.patientsService.uploadReport(data.userId, data.report);
  }

  @MessagePattern(MSG.PATIENT_GET_HISTORY)
  getHistory(@Payload() data: { userId: string }) {
    return this.patientsService.getHistory(data.userId);
  }
}
