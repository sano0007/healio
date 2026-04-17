import { Module } from '@nestjs/common';
import { AppointmentsGatewayController } from './appointments-gateway.controller';

@Module({
  controllers: [AppointmentsGatewayController],
})
export class AppointmentsGatewayModule {}
