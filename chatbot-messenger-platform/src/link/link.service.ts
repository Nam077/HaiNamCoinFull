import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { In, Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinkService {
    constructor(@InjectRepository(Link) private linkRepository: Repository<Link>) {}

    create(createLinkDto: CreateLinkDto) {
        return 'This action adds a new link';
    }

    async findAll() {
        return await this.linkRepository.find({ relations: { fonts: true } });
    }

    findOne(id: number) {
        return `This action returns a #${id} link`;
    }

    update(id: number, updateLinkDto: UpdateLinkDto) {
        return `This action updates a #${id} link`;
    }

    remove(id: number) {
        return `This action removes a #${id} link`;
    }

    async findAllByUrls(urls: string[]): Promise<Link[]> {
        return await this.linkRepository.find({
            where: [
                {
                    url: In(urls),
                },
            ],
        });
    } //

    async bulkCreate(links: CreateLinkDto[]): Promise<Link[]> {
        const result: Link[] = [];
        const findLinks = await this.findAllByUrls(links.map((link) => link.url));
        const createUrls = links.filter((link) => !findLinks.find((findLink) => findLink.url === link.url));
        const chunkedArray = this.chunkArray(createUrls, 100);
        for (const chunk of chunkedArray) {
            const links = await this.linkRepository.save(chunk);
            result.push(...links);
        }
        return [...result, ...findLinks];
    }

    chunkArray(links: CreateLinkDto[], number: number): CreateLinkDto[][] {
        const result = [];
        for (let i = 0; i < links.length; i += number) {
            result.push(links.slice(i, i + number));
        }
        return result;
    }
    async getNameTable() {
        return this.linkRepository.metadata.tableName;
    }

    async setAutoIncrement() {
        await this.linkRepository.query(`ALTER TABLE ${await this.getNameTable()} AUTO_INCREMENT = 1`);
    }

    async deleteAll() {
        const links = await this.findAll();
        await this.linkRepository.remove(links);
        await this.setAutoIncrement();
    }
}
