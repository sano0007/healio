import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('AUTH_SERVICE_HOST', 'localhost'),
            port: c.get<number>('AUTH_SERVICE_PORT', 5001),
          },
        }),
      },
      {
        name: 'PATIENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('PATIENT_SERVICE_HOST', 'localhost'),
            port: c.get<number>('PATIENT_SERVICE_PORT', 5002),
          },
        }),
      },
      {
        name: 'DOCTOR_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('DOCTOR_SERVICE_HOST', 'localhost'),
            port: c.get<number>('DOCTOR_SERVICE_PORT', 5003),
          },
        }),
      },
      {
        name: 'APPOINTMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('APPOINTMENT_SERVICE_HOST', 'localhost'),
            port: c.get<number>('APPOINTMENT_SERVICE_PORT', 5004),
          },
        }),
      },
      {
        name: 'TELEMEDICINE_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('TELEMEDICINE_SERVICE_HOST', 'localhost'),
            port: c.get<number>('TELEMEDICINE_SERVICE_PORT', 5005),
          },
        }),
      },
      {
        name: 'PAYMENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('PAYMENT_SERVICE_HOST', 'localhost'),
            port: c.get<number>('PAYMENT_SERVICE_PORT', 5006),
          },
        }),
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('NOTIFICATION_SERVICE_HOST', 'localhost'),
            port: c.get<number>('NOTIFICATION_SERVICE_PORT', 5007),
          },
        }),
      },
      {
        name: 'AI_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (c: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: c.get('AI_SERVICE_HOST', 'localhost'),
            port: c.get<number>('AI_SERVICE_PORT', 5008),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class ClientsProxyModule {}
