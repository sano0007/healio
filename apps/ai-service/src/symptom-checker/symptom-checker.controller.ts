import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { SymptomCheckerService } from './symptom-checker.service';

@Controller()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @MessagePattern(MSG.AI_SYMPTOM_CHECK)
  checkSymptoms(@Payload() payload: { symptoms: string; patientId: string }) {
    return this.symptomCheckerService.checkSymptoms(payload.symptoms, payload.patientId);
  }
}
