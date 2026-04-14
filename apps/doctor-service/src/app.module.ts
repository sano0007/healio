import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsModule } from './doctors/doctors.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    MongooseModule.forRootAsync({
      useFactory: (config) => ({ uri: config.get('MONGO_DOCTOR_URI') }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    DoctorsModule,
    PrescriptionsModule,
  ],
})
export class AppModule {}