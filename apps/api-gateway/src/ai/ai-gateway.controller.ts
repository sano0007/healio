import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ai')
export class AiGatewayController {
  constructor(
    @Inject('AI_SERVICE') private aiClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('symptom-check')
  async checkSymptoms(
    @Request() req: { user: { userId: string } },
    @Body() dto: { symptoms: string },
  ) {
    return firstValueFrom(
      this.aiClient.send(MSG.AI_SYMPTOM_CHECK, {
        symptoms: dto.symptoms,
        patientId: req.user.userId,
      }),
    );
  }
}
