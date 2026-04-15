import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { SessionsService } from './sessions.service';

@Controller()
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @MessagePattern(MSG.TELE_CREATE_SESSION)
  createSession(@Payload() data: { appointmentId: string; hostId: string }) {
    return this.sessionsService.createSession(data);
  }

  @MessagePattern(MSG.TELE_JOIN_SESSION)
  joinSession(@Payload() data: { sessionId: string; userId: string }) {
    return this.sessionsService.joinSession(data);
  }

  @MessagePattern(MSG.TELE_END_SESSION)
  endSession(@Payload() data: { sessionId: string }) {
    return this.sessionsService.endSession(data.sessionId);
  }
}