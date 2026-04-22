import { Injectable } from '@nestjs/common';

interface JitsiConfig {
  baseUrl: string;
  provider: string;
}

@Injectable()
export class JitsiConfigService {
  private config: JitsiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.JITSI_BASE_URL || 'https://meet.jit.si',
      provider: process.env.VIDEO_PROVIDER || 'jitsi',
    };
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get provider(): string {
    return this.config.provider;
  }

  isConfigured(): boolean {
    return this.config.provider === 'jitsi';
  }

  getMeetingLink(roomName: string): string {
    return `${this.config.baseUrl}/${roomName}`;
  }
}