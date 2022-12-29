import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListFontDto {
    @ApiProperty({ description: 'List font value', example: 'Arial' })
    @IsString({ message: 'Value must be a string' })
    @IsNotEmpty({ message: 'Value must not be empty' })
    value: string;
}
