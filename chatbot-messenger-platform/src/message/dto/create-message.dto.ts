import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @ApiProperty({ description: 'Message value', example: 'value' })
    @IsString({ message: 'Message value must be a string' })
    @IsNotEmpty({ message: 'Message value must not be empty' })
    value: string;
}
