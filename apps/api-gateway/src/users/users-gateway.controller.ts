import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('patients')
export class UsersGatewayController {
  constructor(@Inject('PATIENT_SERVICE') private patientClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: { userId: string } }) {
    return firstValueFrom(this.patientClient.send(MSG.PATIENT_GET, { userId: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req: { user: { userId: string } }, @Body() updates: Record<string, unknown>) {
    return firstValueFrom(this.patientClient.send(MSG.PATIENT_UPDATE, { userId: req.user.userId, updates }));
  }
}
