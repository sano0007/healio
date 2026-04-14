import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, JwtPayload, UserRole } from '@healio/shared-types';

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
    const payload: JwtPayload = { sub: user._id.toString(), email: user.email, role: user.role as UserRole };
    return { access_token: this.jwtService.sign(payload), user: { id: user._id, email: user.email, role: user.role, name: user.name } };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new RpcException('Invalid credentials');

    const valid = await this.usersService.validatePassword(dto.password, user.password);
    if (!valid) throw new RpcException('Invalid credentials');

    const payload: JwtPayload = { sub: user._id.toString(), email: user.email, role: user.role as UserRole };
    return { access_token: this.jwtService.sign(payload), user: { id: user._id, email: user.email, role: user.role, name: user.name } };
  }

  validateToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
