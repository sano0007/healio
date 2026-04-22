import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.interface';
import { JitsiConfigService } from '../jitsi.config';

@Injectable()
export class SessionsService implements OnModuleInit {
  private sessions = new Map<string, Session>();
  private videoProvider: string;

  constructor(
    private jitsiConfig: JitsiConfigService,
    private configService: ConfigService,
  ) {
    this.videoProvider = this.configService.get<string>('VIDEO_PROVIDER') || 'jitsi';
  }

  async onModuleInit() {
    console.log(`Video provider: ${this.videoProvider}`);
    if (this.videoProvider === 'jitsi') {
      console.log('Jitsi video call enabled');
    }
  }

  async createSession(data: { appointmentId: string; hostId: string }) {
    const sessionId = uuidv4();
    const roomName = `healio-${data.appointmentId.slice(-8).replace(/[^a-zA-Z0-9]/g, '')}-${sessionId.slice(0, 8)}`;
    
    let jitsiUrl: string | undefined;
    let token: string | undefined;

    if (this.videoProvider === 'jitsi') {
      jitsiUrl = this.jitsiConfig.getMeetingLink(roomName);
      console.log(`Created Jitsi meeting: ${jitsiUrl}`);
    }

    const session: Session = {
      sessionId,
      appointmentId: data.appointmentId,
      roomName,
      hostId: data.hostId,
      participants: [data.hostId],
      status: 'waiting',
      createdAt: new Date(),
    };
    this.sessions.set(sessionId, session);

    return {
      sessionId,
      roomName: session.roomName,
      jitsiUrl,
      token,
      videoProvider: this.videoProvider,
    };
  }

  async joinSession(data: { sessionId: string; userId: string }) {
    const session = this.sessions.get(data.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (!session.participants.includes(data.userId)) {
      session.participants.push(data.userId);
    }

    if (session.status === 'waiting') {
      session.status = 'active';
    }

    let jitsiUrl: string | undefined;
    if (this.videoProvider === 'jitsi') {
      jitsiUrl = this.jitsiConfig.getMeetingLink(session.roomName);
    }

    return {
      sessionId: session.sessionId,
      roomName: session.roomName,
      jitsiUrl,
      status: session.status,
      videoProvider: this.videoProvider,
    };
  }

  async endSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'ended';
    console.log(`Session ended: ${sessionId}`);

    return {
      sessionId: session.sessionId,
      status: 'ended',
    };
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }
}