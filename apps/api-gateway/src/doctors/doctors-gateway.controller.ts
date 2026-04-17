import {Body, Controller, Get, Inject, Param, Patch, Post, Query, Request, UseGuards} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs';
import {MSG, UserRole} from '@healio/shared-types';
import {JwtAuthGuard} from '../common/guards/jwt-auth.guard';
import {RolesGuard} from '../common/guards/roles.guard';
import {Roles} from '../common/decorators/roles.decorator';

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  availability?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

@Controller('doctors')
export class DoctorsGatewayController {
  constructor(@Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: { userId: string } }) {
    console.log('GET /doctors/me called, user:', req.user);
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: req.user.userId }));
  }

  @Get()
  getAll(@Query() filters: DoctorFilters) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_ALL, filters));
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET, { userId: id }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Patch('me')
  updateProfile(@Request() req: { user: { userId: string } }, @Body() updates: Record<string, unknown>) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_UPDATE, { userId: req.user.userId, updates }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Post('availability')
  setAvailability(
    @Request() req: { user: { userId: string } },
    @Body() body: { availability: { day?: string; dayOfWeek?: number; startTime: string; endTime: string }[] } | { day?: string; dayOfWeek?: number; startTime: string; endTime: string }[],
  ) {
    const DAY_MAP: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
      thursday: 4, friday: 5, saturday: 6,
    };
    const slots = Array.isArray(body) ? body : body.availability;
    const availability = slots.map((s) => ({
      dayOfWeek: s.dayOfWeek ?? DAY_MAP[s.day!.toLowerCase()] ?? 0,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_SET_AVAILABILITY, { userId: req.user.userId, availability }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/verify')
  verifyDoctor(@Param('id') id: string, @Body() body: { isVerified: boolean }) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_VERIFY, { userId: id, isVerified: body.isVerified }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Post('prescriptions')
  issuePrescription(@Request() req: { user: { userId: string } }, @Body() data: Record<string, unknown>) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_ISSUE_PRESCRIPTION, { ...data, doctorId: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('prescriptions')
  getMyPrescriptions(@Request() req: { user: { userId: string; role: string } }) {
    if (req.user.role === UserRole.PATIENT) {
      return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_PRESCRIPTIONS, {patientId: req.user.userId}));
    }
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_PRESCRIPTIONS, {doctorId: req.user.userId}));
  }
}
