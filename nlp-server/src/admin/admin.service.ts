import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Admin) private adminRepository: Repository<Admin>) {}

    create(createAdminDto: CreateAdminDto) {
        return 'This action adds a new admin';
    }

    async findAll(): Promise<Admin[]> {
        return await this.adminRepository.find();
    }

    findOne(id: number) {
        return `This action returns a #${id} admin`;
    }

    update(id: number, updateAdminDto: UpdateAdminDto) {
        return `This action updates a #${id} admin`;
    }

    remove(id: number) {
        return `This action removes a #${id} admin`;
    }

    async deleteByPsid(senderPsid: string): Promise<Admin> {
        const admin = await this.findBySenderPsid(senderPsid);
        if (admin) {
            return await this.adminRepository.remove(admin);
        }
        return null;
    }

    private async findBySenderPsid(senderPsid: string) {
        return this.adminRepository.findOne({
            where: {
                senderPsid: senderPsid,
            },
        });
    }

    async findByPsid(psid: string) {
        return this.adminRepository.findOne({
            where: {
                senderPsid: psid,
            },
        });
    }

    async addAdmin(psid: string): Promise<Admin> {
        const admin = await this.findBySenderPsid(psid);
        if (admin) {
            return null;
        }
        return await this.adminRepository.save({ senderPsid: psid });
    }
}
