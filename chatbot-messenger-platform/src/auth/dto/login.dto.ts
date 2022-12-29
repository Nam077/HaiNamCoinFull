import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'The email of the user', example: 'nam@nam.com' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ description: 'The password of the user', example: '123456' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
