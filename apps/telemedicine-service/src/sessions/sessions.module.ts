import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TwilioConfigService } from '../twilio.config';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, TwilioConfigService],
  exports: [SessionsService, TwilioConfigService],
})
export class SessionsModule {}