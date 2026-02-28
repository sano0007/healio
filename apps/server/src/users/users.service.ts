import {Injectable, NotFoundException} from '@nestjs/common';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'patient' | 'doctor' | 'admin';
    phone?: string;
    dateOfBirth?: Date;
    createdAt: Date;
}

@Injectable()
export class UsersService {
    private users: User[] = [
        {
            id: '1',
            email: 'patient@healio.com',
            name: 'John Patient',
            role: 'patient',
            phone: '+1234567890',
            createdAt: new Date(),
        },
    ];

    findAll() {
        return this.users;
    }

    findById(id: string) {
        const user = this.users.find((u) => u.id === id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    findByEmail(email: string) {
        return this.users.find((u) => u.email === email);
    }

    create(user: Omit<User, 'id' | 'createdAt'>) {
        const newUser: User = {
            ...user,
            id: String(this.users.length + 1),
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    update(id: string, updates: Partial<User>) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.users[index] = {...this.users[index], ...updates};
        return this.users[index];
    }

    delete(id: string) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(index, 1);
        return {deleted: true};
    }
}
