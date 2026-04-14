import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG, InitiatePaymentDto } from '@healio/shared-types';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @MessagePattern(MSG.PAYMENT_GET_ALL)
  getAll() {
    return this.paymentsService.getAll();
  }

  @MessagePattern(MSG.PAYMENT_INITIATE)
  initiatePayment(@Payload() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(dto);
  }

  @MessagePattern(MSG.PAYMENT_CONFIRM)
  confirmPayment(@Payload() data: { checkoutSessionId: string }) {
    return this.paymentsService.confirmPayment(data.checkoutSessionId);
  }

  @MessagePattern(MSG.PAYMENT_GET)
  getPayment(@Payload() data: { paymentId: string }) {
    return this.paymentsService.getPayment(data.paymentId);
  }
}