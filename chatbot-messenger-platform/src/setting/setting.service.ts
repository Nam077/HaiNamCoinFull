import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
    constructor(@InjectRepository(Setting) private settingRepository: Repository<Setting>) {}

    async create(createSettingDto: CreateSettingDto): Promise<Setting> {
        const setting = await this.findByName(createSettingDto.name);
        if (setting) {
            return setting;
        }
        return this.settingRepository.save(createSettingDto);
    }

    async findAll() {
        return this.settingRepository.find();
    }

    async createSettingDefault(name: string, value: string) {
        const setting = await this.findByName(name);
        if (!setting) {
            return this.settingRepository.save({
                name: name,
                value: value,
            });
        }
        return setting;
    }

    async findOne(id: number): Promise<Setting> {
        return this.settingRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    async findByName(name: string) {
        return this.settingRepository.findOne({
            where: {
                name: name,
            },
        });
    }

    async getSettingString(key: string) {
        let setting = await this.findByName(key);
        if (!setting) {
            setting = await this.createSettingDefault(key, '');
        }
        if (setting) {
            return setting.value;
        }
        return '';
    }

    async getPageAccessToken(): Promise<string> {
        return await this.getSettingString('PAGE_ACCESS_TOKEN');
    }

    async updatePageAccessToken(pageAccessToken: string) {
        return await this.updateSetting('PAGE_ACCESS_TOKEN', pageAccessToken);
    }

    async getCanBan() {
        return await this.getSettingBoolean('CAN_BAN');
    }

    async getDownloadMultipleFont() {
        return await this.getSettingBoolean('DOWNLOAD_MULTIPLE_FONT');
    }

    async getSettingBoolean(key: string): Promise<boolean> {
        let setting = await this.findByName(key);

        if (!setting) {
            setting = await this.createSettingDefault(key, 'false');
        }

        if (setting) {
            return setting.value === 'true';
        }
        return false;
    }

    async update(id: number, updateSettingDto: UpdateSettingDto): Promise<Setting> {
        const setting = await this.findOne(id);
        if (setting) {
            if (updateSettingDto.name) {
                if ((await this.findByName(updateSettingDto.name)) && updateSettingDto.name !== setting.name) {
                    return null;
                }
                await this.settingRepository.merge(setting, updateSettingDto);
                return this.settingRepository.save(setting);
            }
        }
        return null;
    }

    remove(id: number) {
        return `This action removes a #${id} setting`;
    }

    async updateSetting(name: string, value: string) {
        let setting = await this.findByName(name);
        if (!setting) {
            setting = await this.createSettingDefault(name, 'false');
        }
        if (setting) {
            setting.value = value;
            return await this.settingRepository.save(setting);
        }
        return null;
    }
}
