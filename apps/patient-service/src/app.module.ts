import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsModule } from './patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config) => ({ uri: config.get('MONGO_PATIENT_URI') }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    PatientsModule,
  ],
})
export class AppModule {}
