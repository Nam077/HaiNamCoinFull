import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLinkDto {
    @ApiProperty({ description: 'Link url', example: 'https://www.nhaccuatui.com' })
    @IsString({ message: 'Link url must be a string' })
    @IsNotEmpty({ message: 'Link url must not be empty' })
    url: string;

    @ApiProperty({ description: 'Id of font', example: 1 })
    @IsNotEmpty({ message: 'Font id must not be empty' })
    idFont: number;
}
