import { Injectable, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.interface';
import { TwilioConfigService } from '../twilio.config';

let Twilio: any;

@Injectable()
export class SessionsService implements OnModuleInit {
  private sessions = new Map<string, Session>();

  constructor(private twilioConfig: TwilioConfigService) {}

  async onModuleInit() {
    try {
      this.twilioConfig.validate();
      Twilio = (await import('twilio')).default;
      console.log('Twilio client initialized successfully');
    } catch (error) {
      console.warn('Twilio not configured, using mock mode:', error.message);
    }
  }

  async createSession(data: { appointmentId: string; hostId: string }) {
    const sessionId = uuidv4();
    const roomName = `healio-${data.appointmentId.slice(-8)}-${Date.now().toString(36)}`;
    let token: string | undefined;
    let roomSid: string | undefined;

    // Generate Twilio token for host if Twilio is configured
    if (Twilio && this.twilioConfig.isConfigured()) {
      token = this.generateToken(roomName, data.hostId, 'host');
      
      try {
        const twilioClient = Twilio(
          this.twilioConfig.accountSid,
          this.twilioConfig.apiSecret
        );
        const twilioRoom = await twilioClient.video.v1.rooms.create({
          uniqueName: roomName,
          type: 'peer-to-peer',
          maxParticipants: 2,
        });
        roomSid = twilioRoom.sid;
        console.log(`Created Twilio room: ${roomSid}`);
      } catch (error: any) {
        // Room might already exist, try to fetch it
        if (error.code === 53113) {
          try {
            const twilioClient = Twilio(
              this.twilioConfig.accountSid,
              this.twilioConfig.apiSecret
            );
            const twilioRoom = await twilioClient.video.v1.rooms(roomName).fetch();
            roomSid = twilioRoom.sid;
            console.log(`Using existing Twilio room: ${roomSid}`);
          } catch (fetchError: any) {
            console.error('Failed to fetch Twilio room:', fetchError.message);
          }
        } else {
          console.error('Failed to create Twilio room:', error.message);
        }
      }
    }

    const session: Session = {
      sessionId,
      appointmentId: data.appointmentId,
      roomName,
      twilioRoomSid: roomSid,
      hostId: data.hostId,
      participants: [data.hostId],
      status: 'waiting',
      createdAt: new Date(),
    };
    this.sessions.set(sessionId, session);

    return {
      sessionId,
      roomName: session.roomName,
      token,
      roomSid,
      twilioRoomSid: roomSid,
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

    // Generate Twilio token for participant if Twilio is configured
    let token: string | undefined;
    if (Twilio && this.twilioConfig.isConfigured()) {
      token = this.generateToken(session.roomName, data.userId, 'participant');
    }

    return {
      sessionId: session.sessionId,
      roomName: session.roomName,
      roomSid: session.twilioRoomSid,
      token,
      twilioRoomSid: session.twilioRoomSid,
      status: session.status,
    };
  }

  async endSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // End Twilio room if exists
    if (Twilio && session.twilioRoomSid) {
      try {
        const twilioClient = Twilio(
          this.twilioConfig.accountSid,
          this.twilioConfig.apiSecret
        );
        await twilioClient.video.v1.rooms(session.twilioRoomSid).update({
          status: 'completed',
        });
        console.log(`Ended Twilio room: ${session.twilioRoomSid}`);
      } catch (error: any) {
        console.error('Failed to end Twilio room:', error.message);
      }
    }

    session.status = 'ended';
    return {
      sessionId: session.sessionId,
      status: 'ended',
    };
  }

  private generateToken(roomName: string, identity: string, role: 'host' | 'participant'): string {
    if (!Twilio) {
      throw new Error('Twilio is not initialized');
    }

    const AccessToken = Twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
      this.twilioConfig.accountSid,
      this.twilioConfig.apiKey,
      this.twilioConfig.apiSecret,
      {
        identity: `${role}-${identity}-${Date.now()}`,
        ttl: 14400, // 4 hours in seconds
      }
    );

    const videoGrant = new VideoGrant({
      room: roomName,
    });
    token.addGrant(videoGrant);

    return token.toJwt();
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }
}