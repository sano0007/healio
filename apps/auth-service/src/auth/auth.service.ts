import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import {
  RegisterDto,
  LoginDto,
  JwtPayload,
  UserRole,
} from '@healio/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new RpcException('Email already in use');

    const user = await this.usersService.create(dto);
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      access_token,
      refresh_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new RpcException('Invalid credentials');

    const valid = await this.usersService.validatePassword(
      dto.password,
      user.password,
    );
    if (!valid) throw new RpcException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      access_token,
      refresh_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }

  validateToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string; role: string; name: string };
  }> {
    const payload = this.jwtService.verify<JwtPayload>(refreshToken);
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new RpcException('User not found');

    const newPayload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const access_token = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });
    return {
      access_token,
      refresh_token: newRefreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }
}
