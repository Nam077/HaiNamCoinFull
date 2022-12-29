import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyService } from '../key/key.service';
import { ImageService } from '../image/image.service';
import { MessageService } from '../message/message.service';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
    constructor(
        @InjectRepository(Response) private responseRepository: Repository<Response>,
        private readonly imageService: ImageService,
        private readonly keyService: KeyService,
        private readonly messageService: MessageService,
    ) {}

    async create(createResponseDto: CreateResponseDto): Promise<Response> {
        const response: Response = await this.findByName(createResponseDto.name);
        if (response) {
            return response;
        }
        const responseCreated: Response = await this.responseRepository.save({
            name: createResponseDto.name,
        });
        if (createResponseDto.keys) {
            responseCreated.keys = await this.keyService.bulkCreate(createResponseDto.keys);
        }
        if (createResponseDto.images) {
            responseCreated.images = await this.imageService.bulkCreate(createResponseDto.images);
        }
        if (createResponseDto.messages) {
            responseCreated.messages = await this.messageService.bulkCreate(createResponseDto.messages);
        }
        await this.responseRepository.save(responseCreated);
        return responseCreated;
    }

    async findByName(name: string): Promise<Response> {
        return await this.responseRepository.findOne({
            where: { name: name },
            relations: {
                keys: true,
                images: true,
                messages: true,
            },
        });
    }

    async findAll(): Promise<Response[]> {
        return await this.responseRepository.find({ relations: { keys: true, images: true, messages: true } });
    }

    async findOne(id: number): Promise<Response> {
        return await this.responseRepository.findOne({
            where: { id: id },
            relations: {
                keys: true,
                images: true,
                messages: true,
            },
        });
    }

    async update(id: number, updateResponseDto: UpdateResponseDto) {
        return `This action updates a #${id} response`;
    }

    async remove(id: number) {
        return `This action removes a #${id} response`;
    }
    async getNameTable() {
        return this.responseRepository.metadata.tableName;
    }

    async setAutoIncrement() {
        await this.responseRepository.query(`ALTER TABLE ${await this.getNameTable()} AUTO_INCREMENT = 1`);
    }

    async deleteAll() {
        const fonts = await this.findAll();
        await this.responseRepository.remove(fonts);
        await this.setAutoIncrement();
    }
}
