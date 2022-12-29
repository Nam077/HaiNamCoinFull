import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateTagDto } from '../../tag/dto/create-tag.dto';
import { CreateMessageDto } from '../../message/dto/create-message.dto';
import { CreateLinkDto } from '../../link/dto/create-link.dto';
import { CreateImageDto } from '../../image/dto/create-image.dto';
import { CreateKeyDto } from '../../key/dto/create-key.dto';

export class CreateFontDto {
    @ApiProperty({ description: 'Font name', example: 'NVN Azkia' })
    @IsString({ message: 'Font name must be a string' })
    @IsNotEmpty({ message: 'Font name must not be empty' })
    name: string;

    @ApiProperty({
        description: 'Font url post',
        example: 'https://www.nhaccuatui.com/playlist/nvn-azkia.1Y4Z5Z5Z5Z5Z.html',
    })
    @IsString({ message: 'Font url post must be a string' })
    @IsNotEmpty({ message: 'Font url post must not be empty' })
    urlPost: string;

    // list of tags
    @ApiProperty({ description: 'Font tags', example: [{ name: 'font' }, { name: 'nvn' }] })
    @IsArray({ message: 'Font tags must be an array' })
    @IsNotEmpty({ message: 'Font tags must not be empty' })
    tags: CreateTagDto[];

    // list of messages
    @ApiProperty({ description: 'Font messages', example: [{ value: 'font' }, { value: 'nvn' }] })
    @IsArray({ message: 'Font messages must be an array' })
    @IsNotEmpty({ message: 'Font messages must not be empty' })
    messages: CreateMessageDto[];

    // list of links
    @ApiProperty({
        description: 'Font links',
        example: [{ url: 'https://www.nhaccuatui.com' }, { url: 'https://www.nhaccuatui2.com' }],
    })
    @IsArray({ message: 'Font links must be an array' })
    @IsNotEmpty({ message: 'Font links must not be empty' })
    links: CreateLinkDto[];

    // list of images

    @ApiProperty({
        description: 'Font images',
        example: [{ url: 'https://www.nhaccuatui.com' }, { url: 'https://www.nhaccuatui2.com' }],
    })
    @IsArray({ message: 'Font images must be an array' })
    @IsNotEmpty({ message: 'Font images must not be empty' })
    images: CreateImageDto[];

    // list of keys
    @ApiProperty({ description: 'Font keys', example: [{ name: 'font', value: 'nvn' }] })
    @IsArray({ message: 'Font keys must be an array' })
    @IsNotEmpty({ message: 'Font keys must not be empty' })
    keys: CreateKeyDto[];

    @ApiProperty({ description: 'Font description', example: 'Font description' })
    @IsString({ message: 'Font description must be a string' })
    @IsNotEmpty({ message: 'Font description must not be empty' })
    description: string;
}
