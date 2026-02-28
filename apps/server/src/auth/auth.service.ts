import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {User, UsersService} from '../users/users.service';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    name: string;
    role: 'patient' | 'doctor' | 'admin';
    phone?: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        // In production, use bcrypt to compare hashed passwords
        const user = this.usersService.findByEmail(email);
        if (user && user.email === email) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {sub: user.id, email: user.email, role: user.role};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        const user = this.usersService.create({
            email: registerDto.email,
            name: registerDto.name,
            role: registerDto.role,
            phone: registerDto.phone,
        });

        const payload = {sub: user.id, email: user.email, role: user.role};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}
