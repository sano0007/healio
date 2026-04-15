export interface Session {
  sessionId: string;
  appointmentId: string;
  roomName: string;
  jitsiUrl: string;
  hostId: string;
  participants: string[];
  status: 'waiting' | 'active' | 'ended';
  createdAt: Date;
}