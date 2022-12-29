import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'The name of the user', example: 'Nam' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'The email of the user', example: 'nam@nam.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email' })
    email: string;

    @ApiProperty({ description: 'The password of the user', example: '123456' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
