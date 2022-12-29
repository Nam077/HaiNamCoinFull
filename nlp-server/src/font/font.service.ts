import { Injectable } from '@nestjs/common';
import { CreateFontDto } from './dto/create-font.dto';
import { UpdateFontDto } from './dto/update-font.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Font } from './entities/font.entity';
import { KeyService } from '../key/key.service';
import { MessageService } from '../message/message.service';
import { LinkService } from '../link/link.service';
import { TagService } from '../tag/tag.service';
import { ImageService } from '../image/image.service';

export interface FontCreate {
    name: string;
    description: string;
    urlPost: string;
}

@Injectable()
export class FontService {
    constructor(
        @InjectRepository(Font) private fontRepository: Repository<Font>,
        private readonly keyService: KeyService,
        private readonly messageService: MessageService,
        private readonly linkService: LinkService,
        private readonly tagService: TagService,
        private readonly imageService: ImageService,
    ) {}

    async create(createFontDto: CreateFontDto): Promise<Font> {
        const font = await this.fontRepository.findOne({ where: { name: createFontDto.name } });
        if (font) {
            return font;
        }
        const fontCreate: FontCreate = {
            name: createFontDto.name,
            description: createFontDto.description,
            urlPost: createFontDto.urlPost,
        };
        const newFont = await this.fontRepository.save(fontCreate);
        if (createFontDto.keys && createFontDto.keys.length > 0) {
            newFont.keys = await this.keyService.bulkCreate(createFontDto.keys);
        }
        if (createFontDto.tags && createFontDto.tags.length > 0) {
            newFont.tags = await this.tagService.bulkCreate(createFontDto.tags);
        }
        if (createFontDto.messages && createFontDto.messages.length > 0) {
            newFont.messages = await this.messageService.bulkCreate(createFontDto.messages);
        }

        if (createFontDto.links && createFontDto.links.length > 0) {
            newFont.links = await this.linkService.bulkCreate(createFontDto.links);
        }
        if (createFontDto.images && createFontDto.images.length > 0) {
            newFont.images = await this.imageService.bulkCreate(createFontDto.images);
        }
        return await this.fontRepository.save(newFont);
    }

    async findByName(name: string): Promise<Font> {
        return await this.fontRepository.findOne({
            where: {
                name: name,
            },
        });
    }

    async findAll(): Promise<Font[]> {
        return await this.fontRepository.find({
            relations: {
                keys: true,
                tags: true,
                links: true,
                messages: true,
                images: true,
            },
        });
    }

    async findOne(id: number) {
        return await this.fontRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async update(id: number, updateFontDto: UpdateFontDto): Promise<Font> {
        throw new Error('Font not found');
    }

    async remove(id: number): Promise<void> {
        const font = await this.findOne(id);
        if (font) {
            await this.fontRepository.remove(font);
        }
        throw new Error('Font not found');
    }

    async getNameTable() {
        return this.fontRepository.metadata.tableName;
    }

    async setAutoIncrement() {
        await this.fontRepository.query(
            'ALTER TABLE ' + '`' + this.fontRepository.metadata.tableName + '`' + ' AUTO_INCREMENT = 1',
        );
    }

    async deleteAll() {
        const fonts = await this.findAll();
        await this.fontRepository.remove(fonts);
        await this.setAutoIncrement();
        await this.tagService.deleteAll();
        await this.keyService.deleteAll();
        await this.linkService.deleteAll();
        await this.messageService.deleteAll();
    }
}
