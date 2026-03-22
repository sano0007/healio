import { Module } from '@nestjs/common';
import { UsersGatewayController } from './users-gateway.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [UsersGatewayController],
  providers: [CloudinaryService],
})
export class UsersGatewayModule {}
