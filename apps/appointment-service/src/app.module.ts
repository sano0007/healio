import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    MongooseModule.forRootAsync({
      useFactory: (config) => ({ uri: config.get('MONGO_APPOINTMENT_URI') }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    AppointmentsModule,
  ],
})
export class AppModule {}