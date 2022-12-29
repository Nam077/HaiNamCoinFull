import { Injectable } from '@nestjs/common';
import { CreateBanDto } from './dto/create-ban.dto';
import { UpdateBanDto } from './dto/update-ban.dto';
import { Ban } from './entities/ban.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BanService {
    constructor(@InjectRepository(Ban) private banRepository: Repository<Ban>) {}

    async create(createBanDto: CreateBanDto): Promise<Ban> {
        const ban = await this.findBySenderPsid(createBanDto.senderPsid);
        if (ban) {
            return ban;
        }
        return this.banRepository.save(createBanDto);
    }

    async addBan(createBanDto: CreateBanDto): Promise<Ban> {
        const ban = await this.findBySenderPsid(createBanDto.senderPsid);
        if (ban) {
            return null;
        }
        return await this.banRepository.save(createBanDto);
    }

    async findBySenderPsid(senderPsid: string): Promise<Ban> {
        return this.banRepository.findOne({
            where: {
                senderPsid: senderPsid,
            },
        });
    }

    async findAll(): Promise<Ban[]> {
        return await this.banRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} ban`;
    }

    update(id: number, updateBanDto: UpdateBanDto) {
        return `This action updates a #${id} ban`;
    }

    remove(id: number) {
        return `This action removes a #${id} ban`;
    }

    async deleteByPsid(psid: string): Promise<Ban> {
        const ban = await this.findBySenderPsid(psid);
        if (ban) {
            return await this.banRepository.remove(ban);
        }
        return null;
    }

    async updateName(senderPsid: string, name: string): Promise<Ban> {
        const ban = await this.findBySenderPsid(senderPsid);
        if (ban) {
            ban.name = name;
            return await this.banRepository.save(ban);
        }
        return null;
    }

    async findByPsid(senderPsid: string) {
        return undefined;
    }
}
