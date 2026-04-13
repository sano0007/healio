import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsProxyModule } from './clients.module';
import { AuthModule } from './auth/auth.module';
import { UsersGatewayModule } from './users/users-gateway.module';
import { DoctorsGatewayModule } from './doctors/doctors-gateway.module';
import { AppointmentsGatewayModule } from './appointments/appointments-gateway.module';
import { TelemedicineGatewayModule } from './telemedicine/telemedicine-gateway.module';
import { PaymentGatewayModule } from './payment/payment-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    ClientsProxyModule,
    AuthModule,
    UsersGatewayModule,
    DoctorsGatewayModule,
    AppointmentsGatewayModule,
    TelemedicineGatewayModule,
    PaymentGatewayModule,
  ],
})
export class AppModule {}
