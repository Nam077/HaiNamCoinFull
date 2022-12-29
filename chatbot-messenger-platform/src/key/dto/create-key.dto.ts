import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeyDto {
    @ApiProperty({ description: 'Key name', example: 'key' })
    @IsString({ message: 'Key name must be a string' })
    @IsNotEmpty({ message: 'Key name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Key value', example: 'value' })
    @IsString({ message: 'Key value must be a string' })
    @IsNotEmpty({ message: 'Key value must not be empty' })
    value: string;
}
