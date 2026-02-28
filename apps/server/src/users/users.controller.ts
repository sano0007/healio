import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {User, UsersService} from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Post()
    create(@Body() user: Omit<User, 'id' | 'createdAt'>) {
        return this.usersService.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updates: Partial<User>) {
        return this.usersService.update(id, updates);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
