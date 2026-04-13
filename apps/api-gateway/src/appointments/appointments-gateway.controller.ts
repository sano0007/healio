import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG, UserRole, AppointmentStatus } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsGatewayController {
  constructor(@Inject('APPOINTMENT_SERVICE') private apptClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  @Post()
  book(@Request() req: { user: { userId: string } }, @Body() dto: { doctorId: string; scheduledAt: string; notes?: string }) {
    return firstValueFrom(this.apptClient.send(MSG.APPOINTMENT_BOOK, { ...dto, patientId: req.user.userId }));
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