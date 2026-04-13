import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG, RegisterDto, LoginDto } from '@healio/shared-types';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return firstValueFrom(this.authClient.send(MSG.AUTH_REGISTER, dto));
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return firstValueFrom(this.authClient.send(MSG.AUTH_LOGIN, dto));
  }
}
