import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        if (await this.findByEmail(createUserDto.email)) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        createUserDto.password = await this.hashPassword(createUserDto.password);
        return await this.userRepository.save(createUserDto);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user: User = await this.findOne(id);
        if (user) {
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                if (await this.findByEmail(updateUserDto.email)) {
                    throw new Error('User already exists');
                }
            }
            this.userRepository.merge(user, updateUserDto);
            return await this.userRepository.save(user);
        }
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async remove(id: number): Promise<string> {
        const user = await this.findOne(id);
        if (user) {
            await this.userRepository.remove(user);
            return 'User deleted';
        }
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    async login(loginDto: LoginDto): Promise<User> {
        const user: User = await this.findByEmail(loginDto.email);
        if (user && (await this.comparePasswords(loginDto.password, user.password))) {
            return user;
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePasswords(newPassword: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(newPassword, passwordHash);
    }

    async register(registerDto: RegisterDto) {
        const user: User = await this.create(registerDto);
        if (user) {
            return user;
        } else throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
}
