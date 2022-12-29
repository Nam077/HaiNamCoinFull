import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBanDto {
    // name , senderPsid, reason
    @ApiProperty({ description: 'Ban name', example: 'NVN Azkia' })
    @IsString({ message: 'Ban name must be a string' })
    @IsNotEmpty({ message: 'Ban name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Ban senderPsid', example: 'senderPsid' })
    @IsString({ message: 'Ban sender psid must be a string' })
    @IsNotEmpty({ message: 'Ban sender psid must not be empty' })
    senderPsid: string;

    @ApiProperty({ description: 'Ban reason', example: 'reason' })
    @IsString({ message: 'Ban reason must be a string' })
    @IsNotEmpty({ message: 'Ban reason must not be empty' })
    reason: string;
}
