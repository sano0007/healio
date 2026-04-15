import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: parseInt(process.env.TELEMEDICINE_SERVICE_PORT || '5005') },
  });
  await app.listen();
  console.log(`Telemedicine-service listening on ${process.env.TELEMEDICINE_SERVICE_PORT || 5005}`);
}
bootstrap();