import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({ description: 'Admin name', example: 'admin' })
    @IsString({ message: 'Admin name must be a string' })
    @IsNotEmpty({ message: 'Admin name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Admin senderPsid', example: 'senderPsid' })
    @IsString({ message: 'Admin sender psid must be a string' })
    @IsNotEmpty({ message: 'Admin sender psid must not be empty' })
    senderPsid: string;
}
