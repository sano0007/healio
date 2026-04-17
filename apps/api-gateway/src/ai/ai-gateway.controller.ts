import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  GatewayTimeoutException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CheckSymptomsDto } from './check-symptoms.dto';

@Controller('ai')
export class AiGatewayController {
  constructor(@Inject('AI_SERVICE') private aiClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('symptom-check')
  async checkSymptoms(
    @Request() req: { user: { userId: string } },
    @Body() dto: CheckSymptomsDto,
  ) {
    try {
      return await firstValueFrom(
        this.aiClient
          .send(MSG.AI_SYMPTOM_CHECK, {
            symptoms: dto.symptoms,
            patientId: req.user.userId,
          })
          .pipe(timeout(30000)),
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new GatewayTimeoutException(
          'AI service timed out. Please try again.',
        );
      }
      throw err;
    }
  }
}
