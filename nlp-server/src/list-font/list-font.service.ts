import { Injectable } from '@nestjs/common';
import { CreateListFontDto } from './dto/create-list-font.dto';
import { UpdateListFontDto } from './dto/update-list-font.dto';
import { ListFont } from './entities/list-font.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FontService } from '../font/font.service';
import { Font } from '../font/entities/font.entity';

@Injectable()
export class ListFontService {
    constructor(
        @InjectRepository(ListFont) private listFontRepository: Repository<ListFont>,
        private readonly fontService: FontService,
    ) {}

    create(createListFontDto: CreateListFontDto) {
        return 'This action adds a new listFont';
    }

    async findAll(): Promise<ListFont[]> {
        return this.listFontRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} listFont`;
    }

    update(id: number, updateListFontDto: UpdateListFontDto) {
        return `This action updates a #${id} listFont`;
    }

    remove(id: number) {
        return `This action removes a #${id} listFont`;
    }

    async creatListFontByFont() {
        await this.truncate();
        const fonts = await this.fontService.findAll();
        const chunkedArray = this.chunkArray(fonts, 30);
        const createListFontDto: CreateListFontDto[] = [];
        for (const font of chunkedArray) {
            const value = font.map((font) => font.name).join('\n\n');
            createListFontDto.push({
                value: value,
            });
        }
        const chunkedArrayDtos = this.chunkArrayDtos(createListFontDto, 100);
        const result: ListFont[] = [];
        for (const chunk of chunkedArrayDtos) {
            const listFonts = await this.listFontRepository.save(chunk);
            result.push(...listFonts);
        }
        return result;
    }

    chunkArrayDtos(messages: CreateListFontDto[], number: number): CreateListFontDto[][] {
        const result = [];
        for (let i = 0; i < messages.length; i += number) {
            result.push(messages.slice(i, i + number));
        }
        return result;
    }

    chunkArray(fonts: Font[], number: number): Font[][] {
        const result = [];
        for (let i = 0; i < fonts.length; i += number) {
            result.push(fonts.slice(i, i + number));
        }
        return result;
    }

    getNameTable() {
        return this.listFontRepository.metadata.tableName;
    }

    async truncate() {
        await this.listFontRepository.query(`TRUNCATE TABLE ${this.getNameTable()}`);
        await this.setAutoIncrement();
    }

    async setAutoIncrement() {
        await this.listFontRepository.query(`ALTER TABLE ${this.getNameTable()} AUTO_INCREMENT = 1`);
    }
}
