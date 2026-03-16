import { Controller, Post, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MSG, RegisterDto, LoginDto, UserRole } from '@healio/shared-types';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('PATIENT_SERVICE') private patientClient: ClientProxy,
    @Inject('DOCTOR_SERVICE') private doctorClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await firstValueFrom(this.authClient.send(MSG.AUTH_REGISTER, dto));

    // Create profile in the appropriate service after auth registers the user
    const profilePayload = { userId: result.user.id, name: dto.name, email: dto.email };
    if (dto.role === UserRole.PATIENT) {
      await firstValueFrom(this.patientClient.send(MSG.PATIENT_CREATE, profilePayload));
    } else if (dto.role === UserRole.DOCTOR) {
      await firstValueFrom(this.doctorClient.send(MSG.DOCTOR_CREATE, profilePayload));
    }

    return result;
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return firstValueFrom(this.authClient.send(MSG.AUTH_LOGIN, dto));
  }
}
