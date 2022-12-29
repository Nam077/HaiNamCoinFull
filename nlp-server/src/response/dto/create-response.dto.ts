import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateMessageDto } from '../../message/dto/create-message.dto';
import { CreateKeyDto } from '../../key/dto/create-key.dto';
import { CreateImageDto } from '../../image/dto/create-image.dto';

export class CreateResponseDto {
    @ApiProperty({ description: 'Chat name', example: 'NVN Azkia' })
    @IsString({ message: 'Chat name must be a string' })
    @IsNotEmpty({ message: 'Chat name must not be empty' })
    name: string;

    // list of messages
    @ApiProperty({ description: 'Font messages', example: [{ value: 'font' }, { value: 'nvn' }] })
    @IsArray({ message: 'Font messages must be an array' })
    @IsNotEmpty({ message: 'Font messages must not be empty' })
    messages: CreateMessageDto[];

    @ApiProperty({ description: 'Font keys', example: [{ name: 'font', value: 'nvn' }] })
    @IsArray({ message: 'Font keys must be an array' })
    @IsNotEmpty({ message: 'Font keys must not be empty' })
    keys: CreateKeyDto[];

    @ApiProperty({
        description: 'Font images',
        example: [{ url: 'https://www.nhaccuatui.com' }, { url: 'https://www.nhaccuatui2.com' }],
    })
    @IsArray({ message: 'Font images must be an array' })
    @IsNotEmpty({ message: 'Font images must not be empty' })
    images: CreateImageDto[];
}
