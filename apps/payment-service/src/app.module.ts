import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config) => ({ uri: config.get('MONGO_PAYMENT_URI') }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    PaymentsModule,
  ],
})
export class AppModule {}
