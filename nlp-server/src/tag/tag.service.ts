import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

    async create(createTagDto: CreateTagDto): Promise<Tag> {
        const tag = await this.findByName(createTagDto.name);
        if (tag) {
            return tag;
        }
        const tagNew = await this.tagRepository.create(createTagDto);
        return await this.tagRepository.save(tagNew);
    }

    async findAll() {
        return await this.tagRepository.find({
            relations: {
                fonts: true,
            },
        });
    }

    async findByName(name: string): Promise<Tag> {
        return await this.tagRepository.findOne({
            where: {
                name: name,
            },
        });
    }

    async findOne(id: number) {
        return await this.tagRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
        const tag: Tag = await this.findOne(id);
        if (updateTagDto.name && updateTagDto.name !== tag.name) {
            tag.name = updateTagDto.name;
        }
        await this.tagRepository.merge(tag, updateTagDto);
        return await this.tagRepository.save(tag);
    }

    async remove(id: number): Promise<Tag> {
        const tag: Tag = await this.findOne(id);
        return await this.tagRepository.remove(tag);
    }

    async findAllByNames(names: string[]): Promise<Tag[]> {
        return await this.tagRepository.find({
            where: [
                {
                    name: In(names),
                },
            ],
        });
    }

    async bulkCreate(tags: CreateTagDto[]): Promise<Tag[]> {
        const existingTags = await this.findAllByNames(tags.map((tag) => tag.name));
        const existingTagNames = existingTags.map((tag) => tag.name);
        const newTags = tags.filter((tag) => !existingTagNames.includes(tag.name));
        const newTagChunks = this.chunkArray(newTags, 100);
        const result: Tag[] = [];
        for (const chunk of newTagChunks) {
            const tags = await this.tagRepository.save(chunk);
            result.push(...tags);
        }
        return [...result, ...existingTags];
    }

    private chunkArray(createTagDtos: CreateTagDto[], number: number): CreateTagDto[][] {
        const result = [];
        for (let i = 0; i < createTagDtos.length; i += number) {
            result.push(createTagDtos.slice(i, i + number));
        }
        return result;
    }
    async getNameTable() {
        return this.tagRepository.metadata.tableName;
    }

    async setAutoIncrement() {
        await this.tagRepository.query(`ALTER TABLE ${await this.getNameTable()} AUTO_INCREMENT = 1`);
    }

    async deleteAll() {
        const tags = await this.findAll();
        await this.tagRepository.remove(tags);
        await this.setAutoIncrement();
    }
}
