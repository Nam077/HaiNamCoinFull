import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {}

    async create(createMessageDto: CreateMessageDto) {
        return 'This action adds a new message';
    }

    async findAll() {
        return await this.messageRepository.find({ relations: { responses: true, fonts: true } });
    }

    async findOne(id: number) {
        return `This action returns a #${id} message`;
    }

    async update(id: number, updateMessageDto: UpdateMessageDto) {
        return `This action updates a #${id} message`;
    }

    async remove(id: number) {
        return `This action removes a #${id} message`;
    }

    async findAllByValue(value: string[]): Promise<Message[]> {
        return this.messageRepository.find({
            where: [
                {
                    value: In(value),
                },
            ],
        });
    }

    async bulkCreate(messages: CreateMessageDto[]) {
        const result: Message[] = [];
        const findMessages = await this.findAllByValue(messages.map((message) => message.value));
        const createMessages = messages.filter(
            (message) => !findMessages.find((findMessage) => findMessage.value === message.value),
        );
        const chunkedArray = this.chunkArray(createMessages, 100);
        for (const chunk of chunkedArray) {
            const messages = await this.messageRepository.save(chunk);
            result.push(...messages);
        }
        return [...result, ...findMessages];
    }

    chunkArray(messages: CreateMessageDto[], number: number): CreateMessageDto[][] {
        const result = [];
        for (let i = 0; i < messages.length; i += number) {
            result.push(messages.slice(i, i + number));
        }
        return result;
    }

    async getNameTable() {
        return this.messageRepository.metadata.tableName;
    }

    async setAutoIncrement() {
        await this.messageRepository.query(`ALTER TABLE ${await this.getNameTable()} AUTO_INCREMENT = 1`);
    }

    async deleteAll() {
        const messages = await this.findAll();
        await this.messageRepository.remove(messages);
        await this.setAutoIncrement();
    }
}
