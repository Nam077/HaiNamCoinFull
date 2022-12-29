import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from './entities/key.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class KeyService {
    constructor(@InjectRepository(Key) private readonly keyRepository: Repository<Key>) {}

    async create(createKeyDto: CreateKeyDto): Promise<Key> {
        return await this.keyRepository.save(createKeyDto);
    }

    async findAll(): Promise<Key[]> {
        return await this.keyRepository.find({
            relations: {
                response: { messages: true, images: true },
                font: { messages: true, links: true, images: true },
            },
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} key`;
    }

    update(id: number, updateKeyDto: UpdateKeyDto) {
        return `This action updates a #${id} key`;
    }

    remove(id: number) {
        return `This action removes a #${id} key`;
    }

    async findAllByValues(values: string[]): Promise<Key[]> {
        return await this.keyRepository.find({
            where: [
                {
                    name: In(values),
                },
            ],
        });
    }

    async bulkCreate(createKeyDto: CreateKeyDto[]): Promise<Key[]> {
        // split 100 records per insert
        const result: Key[] = [];
        const findValues: Key[] = await this.findAllByValues(createKeyDto.map((key) => key.name));
        // remove existing names
        const createNames: CreateKeyDto[] = createKeyDto.filter((key) => {
            return !findValues.find((findKey) => findKey.name === key.name);
        });

        const chunkedArray = this.chunkArray(createNames, 100);
        for (const chunk of chunkedArray) {
            const keys = await this.keyRepository.save(chunk);
            result.push(...keys);
        }
        return [...result];
    }

    private chunkArray(createKeyDto: CreateKeyDto[], number: number): CreateKeyDto[][] {
        const result = [];
        for (let i = 0; i < createKeyDto.length; i += number) {
            result.push(createKeyDto.slice(i, i + number));
        }
        return result;
    }

    public async getTableName() {
        return this.keyRepository.metadata.tableName;
    }

    private async setAutoIncrement() {
        await this.keyRepository.query(
            'ALTER TABLE ' + '`' + (await this.getTableName()) + '`' + ' AUTO_INCREMENT = 1',
        );
    }

    async deleteAll() {
        const keys = await this.findAll();
        await this.keyRepository.remove(keys);
        await this.setAutoIncrement(); //
    }
}
