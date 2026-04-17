import { Module } from '@nestjs/common';
import { TelemedicineGatewayController } from './telemedicine-gateway.controller';

@Module({
  controllers: [TelemedicineGatewayController],
})
export class TelemedicineGatewayModule {}
