export interface Session {
  sessionId: string;
  appointmentId: string;
  roomName: string;
  twilioRoomSid?: string;
  hostId: string;
  participants: string[];
  status: 'waiting' | 'active' | 'ended';
  createdAt: Date;
}

export interface CreateSessionResponse {
  sessionId: string;
  roomName: string;
  token?: string;
  roomSid?: string;
  twilioRoomSid?: string;
}

export interface JoinSessionResponse {
  sessionId: string;
  roomName: string;
  roomSid?: string;
  token?: string;
  twilioRoomSid?: string;
  status: string;
}

export interface EndSessionResponse {
  sessionId: string;
  status: string;
}