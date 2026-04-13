import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG, UserRole } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('doctors')
export class DoctorsGatewayController {
  constructor(@Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy) {}

  @Get()
  getAll() {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_GET_ALL, {}));
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
  setAvailability(@Request() req: { user: { userId: string } }, @Body() availability: unknown[]) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_SET_AVAILABILITY, { userId: req.user.userId, availability }));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Post('prescriptions')
  issuePrescription(@Request() req: { user: { userId: string } }, @Body() data: Record<string, unknown>) {
    return firstValueFrom(this.doctorClient.send(MSG.DOCTOR_ISSUE_PRESCRIPTION, { ...data, doctorId: req.user.userId }));
  }
}
