import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG, AppointmentStatus } from '@healio/shared-types';
import { AppointmentsService } from './appointments.service';

@Controller()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @MessagePattern(MSG.APPOINTMENT_BOOK)
  book(@Payload() dto: { patientId: string; doctorId: string; scheduledAt: string; notes?: string }) {
    return this.appointmentsService.book(dto);
  }

  @MessagePattern(MSG.APPOINTMENT_CANCEL)
  cancel(@Payload() data: { appointmentId: string; reason?: string }) {
    return this.appointmentsService.cancel(data.appointmentId, data.reason);
  }

  @MessagePattern(MSG.APPOINTMENT_UPDATE_STATUS)
  updateStatus(@Payload() data: { appointmentId: string; status: AppointmentStatus }) {
    return this.appointmentsService.updateStatus(data.appointmentId, data.status);
  }

  @MessagePattern(MSG.APPOINTMENT_GET)
  getById(@Payload() data: { appointmentId: string }) {
    return this.appointmentsService.getById(data.appointmentId);
  }

  @MessagePattern(MSG.APPOINTMENT_GET_BY_PATIENT)
  getByPatient(@Payload() data: { patientId: string }) {
    return this.appointmentsService.getByPatient(data.patientId);
  }

  @MessagePattern(MSG.APPOINTMENT_GET_BY_DOCTOR)
  getByDoctor(@Payload() data: { doctorId: string }) {
    return this.appointmentsService.getByDoctor(data.doctorId);
  }
}