import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
    // url
    @ApiProperty({ description: 'Image url', example: 'url' })
    @IsString({ message: 'Image url must be a string' })
    @IsNotEmpty({ message: 'Image url must not be empty' })
    url: string;
}
