import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { MSG, RegisterDto, LoginDto } from '@healio/shared-types';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern(MSG.AUTH_REGISTER)
  register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern(MSG.AUTH_LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern(MSG.AUTH_VALIDATE)
  validate(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
