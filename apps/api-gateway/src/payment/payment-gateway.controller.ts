import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentGatewayController {
  constructor(@Inject('PAYMENT_SERVICE') private paymentClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Request() req: { user: { userId: string } }, @Body() body: { appointmentId: string; amount: number; currency: string }) {
    return firstValueFrom(this.paymentClient.send(MSG.PAYMENT_INITIATE, { ...body, patientId: req.user.userId }));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPayment(@Param('id') id: string) {
    return firstValueFrom(this.paymentClient.send(MSG.PAYMENT_GET, { paymentId: id }));
  }
}