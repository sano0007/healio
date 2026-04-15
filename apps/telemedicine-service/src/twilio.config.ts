import { Injectable } from '@nestjs/common';

interface TwilioConfig {
  accountSid: string;
  apiKey: string;
  apiSecret: string;
}

const DEFAULT_VALUES = {
  accountSid: '',
  apiKey: '',
  apiSecret: '',
};

@Injectable()
export class TwilioConfigService {
  private config: TwilioConfig;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || DEFAULT_VALUES.accountSid,
      apiKey: process.env.TWILIO_API_KEY || DEFAULT_VALUES.apiKey,
      apiSecret: process.env.TWILIO_API_SECRET || DEFAULT_VALUES.apiSecret,
    };
  }

  get accountSid(): string {
    return this.config.accountSid;
  }

  get apiKey(): string {
    return this.config.apiKey;
  }

  get apiSecret(): string {
    return this.config.apiSecret;
  }

  isConfigured(): boolean {
    return !!(
      this.config.accountSid &&
      this.config.apiKey &&
      this.config.apiSecret
    );
  }

  validate(): void {
    if (!this.isConfigured()) {
      throw new Error(
        'Twilio is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, and TWILIO_API_SECRET environment variables.'
      );
    }
  }
}