import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MSG, UserRole } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminGatewayController {
  constructor(
    @Inject('PATIENT_SERVICE') private patientClient: ClientProxy,
    @Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy,
    @Inject('APPOINTMENT_SERVICE') private apptClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
  ) {}

  @Get('stats')
  async getStats() {
    const [patients, doctors, appointments, payments] = await Promise.all([
      firstValueFrom(this.patientClient.send(MSG.PATIENT_GET_ALL, {})).catch(() => []),
      firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_ALL_ADMIN, {})).catch(() => []),
      firstValueFrom(this.apptClient.send(MSG.APPOINTMENT_GET_ALL, {})).catch(() => []),
      firstValueFrom(this.paymentClient.send(MSG.PAYMENT_GET_ALL, {})).catch(() => []),
    ]);

    const revenue = (payments as { status: string; amount: number }[])
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    const apptList = appointments as { status: string }[];

    return {
      totalPatients: (patients as unknown[]).length,
      totalDoctors: (doctors as unknown[]).length,
      verifiedDoctors: (doctors as { isVerified: boolean }[]).filter(d => d.isVerified).length,
      pendingVerification: (doctors as { isVerified: boolean }[]).filter(d => !d.isVerified).length,
      totalAppointments: apptList.length,
      appointmentsByStatus: {
        pending: apptList.filter(a => a.status === 'pending').length,
        confirmed: apptList.filter(a => a.status === 'confirmed').length,
        completed: apptList.filter(a => a.status === 'completed').length,
        cancelled: apptList.filter(a => a.status === 'cancelled').length,
      },
      totalRevenue: revenue,
      totalPayments: (payments as unknown[]).length,
      successfulPayments: (payments as { status: string }[]).filter(p => p.status === 'success').length,
    };
  }

  @Get('patients')
  getPatients() {
    return firstValueFrom(this.patientClient.send(MSG.PATIENT_GET_ALL, {}));
  }

  @Get('doctors')
  getDoctors() {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_ALL_ADMIN, {}));
  }

  @Get('appointments')
  getAppointments() {
    return firstValueFrom(this.apptClient.send(MSG.APPOINTMENT_GET_ALL, {}));
  }

  @Get('payments')
  getPayments() {
    return firstValueFrom(this.paymentClient.send(MSG.PAYMENT_GET_ALL, {}));
  }

  @Patch('doctors/:id/verify')
  verifyDoctor(@Param('id') id: string, @Body() body: { isVerified: boolean }) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_VERIFY, { userId: id, isVerified: body.isVerified }));
  }
}
