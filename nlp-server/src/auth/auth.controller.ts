import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { IsPublic } from '../decorators/auth/auth.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @ApiOperation({ summary: 'Login' })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @IsPublic()
    @ApiOperation({ summary: 'Register' })
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'Logout' })
    @Post('logout')
    logout() {
        return this.authService.logout();
    }
}
