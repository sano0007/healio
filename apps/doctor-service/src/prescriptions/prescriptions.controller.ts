import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { PrescriptionsService } from './prescriptions.service';

@Controller()
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @MessagePattern(MSG.DOCTOR_ISSUE_PRESCRIPTION)
  issuePrescription(@Payload() data: Record<string, unknown>) {
    return this.prescriptionsService.issuePrescription(data as Record<string, unknown>);
  }

  @MessagePattern(MSG.DOCTOR_GET_PRESCRIPTIONS)
  getPrescriptions(@Payload() data: { doctorId?: string; patientId?: string }) {
    if (data.doctorId) return this.prescriptionsService.getByDoctor(data.doctorId);
    if (data.patientId) return this.prescriptionsService.getByPatient(data.patientId);
    return [];
  }
}