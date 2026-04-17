import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SymptomCheckerModule } from './symptom-checker/symptom-checker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    SymptomCheckerModule,
  ],
})
export class AppModule {}
