import { Controller, Post, Patch, Body, UseGuards, Request, Param } from '@nestjs/common';
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
  async createSession(@Request() req: { user: { userId: string } }, @Body() body: { appointmentId: string }) {
    const result = await firstValueFrom(this.teleClient.send(MSG.TELE_CREATE_SESSION, { 
      appointmentId: body.appointmentId, 
      hostId: req.user.userId 
    }));
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinSession(@Request() req: { user: { userId: string } }, @Body() body: { sessionId: string }) {
    const result = await firstValueFrom(this.teleClient.send(MSG.TELE_JOIN_SESSION, { 
      sessionId: body.sessionId, 
      userId: req.user.userId 
    }));
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':sessionId/end')
  async endSession(@Param('sessionId') sessionId: string) {
    const result = await firstValueFrom(this.teleClient.send(MSG.TELE_END_SESSION, { sessionId }));
    return result;
  }
}