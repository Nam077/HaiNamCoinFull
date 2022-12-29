import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/at.strategy';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async login(loginDto: LoginDto): Promise<any> {
        const user: User = await this.userService.login(loginDto);
        if (user) {
            return {
                access_token: await this.getAccessToken(user),
            };
        } else throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    async getAccessToken(user: User) {
        const payload = { id: user.id, email: user.email };
        return this.jwtService.sign(payload, { secret: 'nvn-font', expiresIn: '1h' });
    }

    //tạo mới 1 strategy
    async register(registerDto: RegisterDto) {
        const user: User = await this.userService.register(registerDto);
        if (user) {
            return await this.getAccessToken(user);
        } else throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    async logout() {
        return 'logout';
    }

    async validateUser(payload: JwtPayload): Promise<boolean> {
        const user = await this.userService.findByEmail(payload.email);
        return !!user;
    }
}
