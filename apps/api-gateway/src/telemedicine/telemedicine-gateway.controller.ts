import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('sessions')
export class TelemedicineGatewayController {
  constructor(@Inject('TELEMEDICINE_SERVICE') private teleClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createSession(@Request() req: { user: { userId: string } }, @Body() body: { appointmentId: string }) {
    return firstValueFrom(this.teleClient.send(MSG.TELE_CREATE_SESSION, { appointmentId: body.appointmentId, hostId: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  joinSession(@Request() req: { user: { userId: string } }, @Body() body: { sessionId: string }) {
    return firstValueFrom(this.teleClient.send(MSG.TELE_JOIN_SESSION, { sessionId: body.sessionId, userId: req.user.userId }));
  }
}