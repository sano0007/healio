import { Module } from '@nestjs/common';
import { DoctorsGatewayController } from './doctors-gateway.controller';

@Module({
  controllers: [DoctorsGatewayController],
})
export class DoctorsGatewayModule {}
