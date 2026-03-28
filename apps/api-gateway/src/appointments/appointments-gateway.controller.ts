import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MSG, UserRole, AppointmentStatus, NotificationType } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsGatewayController {
  constructor(
    @Inject('APPOINTMENT_SERVICE') private apptClient: ClientProxy,
    @Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy,
    @Inject('PATIENT_SERVICE') private patientClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
    private config: ConfigService,
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

    const appointment = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_BOOK, { ...dto, patientId: req.user.userId }),
    );

    // Fire-and-forget notifications to patient and doctor
    this.emitBookingNotification(req.user.userId, dto.doctorId, appointment).catch(() => {});

    return appointment;
  }

  private async emitBookingNotification(patientId: string, doctorId: string, appointment: { _id?: string; scheduledAt?: string; notes?: string }) {
    const [patient, doctorProfile] = await Promise.all([
      firstValueFrom(this.patientClient.send(MSG.PATIENT_GET, { userId: patientId })).catch(() => null),
      firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: doctorId })).catch(() => null),
    ]);

    const payload = {
      appointmentId: appointment._id ?? '',
      scheduledAt: appointment.scheduledAt ?? '',
      patientName: patient?.name ?? 'Patient',
      doctorName: doctorProfile?.name ?? 'Doctor',
      doctorSpecialty: doctorProfile?.specialty ?? '',
      notes: appointment.notes ?? '',
    };

    if (patient?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type: NotificationType.APPOINTMENT_BOOKED,
        recipientRole: 'patient',
        recipientEmail: patient.email,
        recipientPhone: patient.phone ?? undefined,
        payload,
      });
    }
    if (doctorProfile?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type: NotificationType.APPOINTMENT_BOOKED,
        recipientRole: 'doctor',
        recipientEmail: doctorProfile.email,
        recipientPhone: doctorProfile.phone ?? undefined,
        payload,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyAppointments(@Request() req: { user: { userId: string; role: string } }) {
    const pattern = req.user.role === UserRole.DOCTOR ? MSG.APPOINTMENT_GET_BY_DOCTOR : MSG.APPOINTMENT_GET_BY_PATIENT;
    return firstValueFrom(this.apptClient.send(pattern, { [req.user.role === UserRole.DOCTOR ? 'doctorId' : 'patientId']: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    const appointment = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_CANCEL, { appointmentId: id, reason: body.reason }),
    );
    this.emitStatusNotification(appointment, NotificationType.APPOINTMENT_CANCELLED).catch(() => {});
    return appointment;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: AppointmentStatus }) {
    // Doctor approving → create payment intent, set to awaiting_payment, send payment URL to patient
    if (body.status === AppointmentStatus.CONFIRMED) {
      return this.handleDoctorApproval(id);
    }

    const appointment = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_UPDATE_STATUS, { appointmentId: id, status: body.status }),
    );

    if (body.status === AppointmentStatus.COMPLETED) {
      this.emitStatusNotification(appointment, NotificationType.CONSULTATION_COMPLETED).catch(() => {});
    }

    return appointment;
  }

  private async handleDoctorApproval(appointmentId: string) {
    // Fetch appointment to get patientId, doctorId, scheduledAt
    const appointment = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_GET, { appointmentId }),
    );

    const [patient, doctor] = await Promise.all([
      firstValueFrom(this.patientClient.send(MSG.PATIENT_GET, { userId: appointment.patientId })).catch(() => null),
      firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: appointment.doctorId })).catch(() => null),
    ]);

    const amount = doctor?.consultationFee ?? 0;
    if (!amount || amount <= 0) {
      throw new BadRequestException('Doctor has not set a consultation fee. Update your profile before approving appointments.');
    }
    const currency = 'usd';

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const successUrl = `${frontendUrl}/appointments?payment=success&appointmentId=${appointmentId}`;
    const cancelUrl  = `${frontendUrl}/appointments?payment=cancelled`;

    // Create Stripe Checkout Session
    const { paymentId, checkoutUrl } = await firstValueFrom(
      this.paymentClient.send(MSG.PAYMENT_INITIATE, {
        appointmentId,
        patientId: appointment.patientId,
        amount,
        currency,
        doctorName: doctor?.name,
        successUrl,
        cancelUrl,
      }),
    );

    const paymentUrl = checkoutUrl;

    // Set appointment to awaiting_payment
    const updated = await firstValueFrom(
      this.apptClient.send(MSG.APPOINTMENT_UPDATE_STATUS, {
        appointmentId,
        status: AppointmentStatus.AWAITING_PAYMENT,
      }),
    );

    // Send payment URL to patient via SMS + email (fire-and-forget)
    if (patient?.email) {
      const payload = {
        appointmentId,
        scheduledAt: appointment.scheduledAt,
        doctorName: doctor?.name ?? 'Doctor',
        patientName: patient.name ?? 'Patient',
        amount,
        currency: currency.toUpperCase(),
        paymentUrl,
      };
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type: NotificationType.PAYMENT_REQUESTED,
        recipientRole: 'patient',
        recipientEmail: patient.email,
        recipientPhone: patient.phone ?? undefined,
        payload,
      });
    }

    return { ...updated.toObject?.() ?? updated, paymentUrl, paymentId };
  }

  private async emitStatusNotification(
    appointment: { _id?: string; patientId?: string; doctorId?: string; scheduledAt?: string },
    type: NotificationType,
  ) {
    if (!appointment?.patientId || !appointment?.doctorId) return;

    const [patient, doctorProfile] = await Promise.all([
      firstValueFrom(this.patientClient.send(MSG.PATIENT_GET, { userId: appointment.patientId })).catch(() => null),
      firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: appointment.doctorId })).catch(() => null),
    ]);

    const payload = {
      appointmentId: appointment._id ?? '',
      scheduledAt: appointment.scheduledAt ?? '',
      patientName: patient?.name ?? 'Patient',
      doctorName: doctorProfile?.name ?? 'Doctor',
    };

    if (patient?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type,
        recipientRole: 'patient',
        recipientEmail: patient.email,
        recipientPhone: patient.phone ?? undefined,
        payload,
      });
    }
    if (doctorProfile?.email) {
      this.notificationClient.emit(MSG.NOTIFY_SEND, {
        type,
        recipientRole: 'doctor',
        recipientEmail: doctorProfile.email,
        recipientPhone: doctorProfile.phone ?? undefined,
        payload,
      });
    }
  }
}