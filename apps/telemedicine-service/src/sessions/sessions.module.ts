import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { JitsiConfigService } from '../jitsi.config';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, JitsiConfigService],
  exports: [SessionsService, JitsiConfigService],
})
export class SessionsModule {}