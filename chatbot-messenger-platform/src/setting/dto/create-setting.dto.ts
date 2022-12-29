import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
    // name , value
    @ApiProperty({ description: 'Setting name', example: 'setting' })
    @IsString({ message: 'Setting name must be a string' })
    @IsNotEmpty({ message: 'Setting name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Setting value', example: 'value' })
    @IsString({ message: 'Setting value must be a string' })
    @IsNotEmpty({ message: 'Setting value must not be empty' })
    value: string;
}
