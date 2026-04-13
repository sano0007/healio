import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @MessagePattern(MSG.PAYMENT_INITIATE)
  initiatePayment(@Payload() dto: { appointmentId: string; patientId: string; amount: number; currency: string }) {
    return this.paymentsService.initiatePayment(dto);
  }

  @MessagePattern(MSG.PAYMENT_CONFIRM)
  confirmPayment(@Payload() data: { stripePaymentIntentId: string }) {
    return this.paymentsService.confirmPayment(data.stripePaymentIntentId);
  }

  @MessagePattern(MSG.PAYMENT_GET)
  getPayment(@Payload() data: { paymentId: string }) {
    return this.paymentsService.getPayment(data.paymentId);
  }
}