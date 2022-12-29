import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
    @ApiProperty({ description: 'Tag name', example: 'tag' })
    @IsString({ message: 'Tag name must be a string' })
    @IsNotEmpty({ message: 'Tag name must not be empty' })
    name: string;
}
