import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG, UserRole, AppointmentStatus } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsGatewayController {
  constructor(
    @Inject('APPOINTMENT_SERVICE') private apptClient: ClientProxy,
    @Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Post()
  async book(
    @Request() req: { user: { userId: string } },
    @Body() dto: { doctorId: string; scheduledAt: string; notes?: string },
  ) {
    const requested = new Date(dto.scheduledAt);
    if (isNaN(requested.getTime())) {
      throw new BadRequestException('Invalid scheduledAt date');
    }

    // Fetch doctor profile to check availability
    const doctor = await firstValueFrom(
      this.doctorClient.send(MSG.DOCTOR_GET, { userId: dto.doctorId }),
    ).catch(() => null);

    if (doctor && doctor.availability?.length) {
      const dayOfWeek = requested.getUTCDay(); // 0 = Sunday
      const requestedMinutes = requested.getUTCHours() * 60 + requested.getUTCMinutes();

      const slot = doctor.availability.find((s: { dayOfWeek: number; startTime: string; endTime: string; slotDurationMins?: number }) => {
        if (s.dayOfWeek !== dayOfWeek) return false;
        const [sh, sm] = s.startTime.split(':').map(Number);
        const [eh, em] = s.endTime.split(':').map(Number);
        return requestedMinutes >= sh * 60 + sm && requestedMinutes < eh * 60 + em;
      });

      if (!slot) {
        throw new BadRequestException(
          `Doctor is not available on that day/time. Check their availability schedule.`,
        );
      }

      // Check for conflicting appointment in the same slot window
      const existing: { scheduledAt: string }[] = await firstValueFrom(
        this.apptClient.send(MSG.APPOINTMENT_GET_BY_DOCTOR, { doctorId: dto.doctorId }),
      ).catch(() => []);

      const slotDuration = 30 * 60 * 1000; // 30-minute slots
      const conflict = existing.some(a => {
        const diff = Math.abs(new Date(a.scheduledAt).getTime() - requested.getTime());
        return diff < slotDuration;
      });

      if (conflict) {
        throw new BadRequestException('This time slot is already booked. Please choose another time.');
      }
    }

    return firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_BOOK, { ...dto, patientId: req.user.userId }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyAppointments(@Request() req: { user: { userId: string; role: string } }) {
    const pattern = req.user.role === UserRole.DOCTOR ? MSG.APPOINTMENT_GET_BY_DOCTOR : MSG.APPOINTMENT_GET_BY_PATIENT;
    return firstValueFrom(this.apptClient.send(pattern, { [req.user.role === UserRole.DOCTOR ? 'doctorId' : 'patientId']: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return firstValueFrom(this.apptClient.send(MSG.APPOINTMENT_CANCEL, { appointmentId: id, reason: body.reason }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: AppointmentStatus }) {
    return firstValueFrom(this.apptClient.send(MSG.APPOINTMENT_UPDATE_STATUS, { appointmentId: id, status: body.status }));
  }
}