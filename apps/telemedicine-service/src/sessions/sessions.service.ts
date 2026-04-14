import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.interface';

@Injectable()
export class SessionsService {
  private sessions = new Map<string, Session>();

  createSession(data: { appointmentId: string; hostId: string }) {
    const sessionId = uuidv4();
    const roomName = `healio-${data.appointmentId.slice(-8)}-${Date.now().toString(36)}`;
    const jitsiBase = process.env.JITSI_BASE_URL || 'https://meet.jit.si';
    const session: Session = {
      sessionId,
      appointmentId: data.appointmentId,
      roomName,
      jitsiUrl: `${jitsiBase}/${roomName}`,
      hostId: data.hostId,
      participants: [data.hostId],
      status: 'waiting',
      createdAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  joinSession(data: { sessionId: string; userId: string }) {
    const session = this.sessions.get(data.sessionId);
    if (!session) throw new Error('Session not found');
    if (!session.participants.includes(data.userId)) {
      session.participants.push(data.userId);
    }
    if (session.status === 'waiting') session.status = 'active';
    return session;
  }

  endSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    session.status = 'ended';
    return session;
  }
}