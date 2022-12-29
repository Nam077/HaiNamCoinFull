import { Injectable } from '@nestjs/common';
import { ResponseService } from '../response/response.service';
import { KeyService } from '../key/key.service';
import { FontService } from '../font/font.service';
import { ImageService } from '../image/image.service';
import { DataSheet, ExcelService } from './excel/excel.service';
import { CrawlerService } from './crawler/crawler.service';
import { SettingService } from '../setting/setting.service';
import { ListFontService } from '../list-font/list-font.service';
import { ChemistryService } from './chemistry/chemistry.service';
import { BanService } from '../ban/ban.service';
import { Font } from '../font/entities/font.entity';
import { AdminService } from '../admin/admin.service';
import { Key } from '../key/entities/key.entity';
import { ListFont } from '../list-font/entities/list-font.entity';
import { Ban } from '../ban/entities/ban.entity';
import { Response } from '../response/entities/response.entity';
import { FoodService } from '../food/food.service';
import { Food } from '../food/entities/food.entity';

@Injectable()
export class ChatService {
    private keys: Key[] = [];
    private listFonts: ListFont[] = [];
    private adminSenderPsid: string[] = [];
    private fonts: Font[] = [];

    constructor(
        private readonly keyService: KeyService,
        private readonly fontService: FontService,
        private readonly imageService: ImageService,
        private readonly responseService: ResponseService,
        private readonly excelService: ExcelService,
        private readonly crawlerService: CrawlerService,
        private readonly settingService: SettingService,
        private readonly listFontService: ListFontService,
        private readonly chemistryService: ChemistryService,
        private readonly banService: BanService,
        private readonly adminService: AdminService,
        private readonly foodService: FoodService,
    ) {
        new Promise<void>(async () => {
            await this.init();
        }).then();
    }

    async init() {
        this.keys = await this.keyService.findAll();
        this.listFonts = await this.listFontService.findAll();
        this.adminSenderPsid = await this.getAllAdmins();
        this.fonts = await this.fontService.findAll();
    }

    public async updateAdminSenderPsid() {
        this.adminSenderPsid = await this.getAllAdmins();
    }

    public async updateKeys() {
        this.keys = await this.keyService.findAll();
    }

    public async getFontAndResponse(message: string): Promise<DataChat> {
        let fonts: Font[] = [];
        const responses: Response[] = [];
        this.keys.forEach((key: Key) => {
            const value = key.value;
            if (message.toLowerCase().includes(value)) {
                if (key.font) {
                    fonts.push(key.font);
                }
                if (key.response) {
                    responses.push(key.response);
                }
            }
        });
        if (!(await this.settingService.getSettingBoolean('DOWNLOAD_MULTIPLE_FONT')) && fonts.length > 1) {
            fonts = fonts.slice(0, 1);
        }
        return { fonts, responses };
    }

    public getListFont(): ListFont[] {
        return this.listFonts;
    }

    async getAllAdmins(): Promise<string[]> {
        const admins = await this.adminService.findAll();
        const adminsId: string[] = [];
        for (let i = 0; i < admins.length; i++) {
            const admin = admins[i];
            adminsId.push(admin.senderPsid);
        }
        return adminsId;
    }

    async getLuckNumber(message: string) {
        return this.crawlerService.getLuckyNumber(message);
    }

    async getDataXoSo() {
        return this.crawlerService.crawlerXSMB();
    }

    async getDataCrawlerYoutube(message: string) {
        return await this.crawlerService.getYoutube(message);
    }

    async getDataCrawlerCovid(message: string) {
        return await this.crawlerService.crawlerCovid19(message);
    }

    async getTalkToBot(message: string) {
        return await this.crawlerService.apiTalk(message);
    }

    async getDataCrawlerGoogle(message: string) {
        return await this.crawlerService.getCrawler(message);
    }

    async getChatGPT(message: string) {
        return await this.crawlerService.getChatGPT(message);
    }

    async updateDataBySheet() {
        await this.fontService.deleteAll();
        await this.responseService.deleteAll();
        const dataFromSheet: DataSheet = await this.excelService.getDataFromSheet();
        const fonts = dataFromSheet.fonts;
        for (let i = 0; i < fonts.length; i++) {
            const font = fonts[i];
            await this.fontService.create(font);
        }

        const responses = dataFromSheet.responses;
        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            await this.responseService.create(response);
        }

        await this.listFontService.creatListFontByFont();
        await this.init();
        return 'Cập nhật dữ liệu thành công';
    }

    async updateBanName(senderPsid: string, name: string) {
        return await this.banService.updateName(senderPsid, name);
    }

    async functionAdmin(senderPsid: string, message: string): Promise<AdminFunction> {
        if (!this.adminSenderPsid.includes(senderPsid)) {
            return;
        }
        if (message.includes('@nvn ban')) {
            //@nvn ban psid reason or @nvn ban psid
            const validate: string = message.replace('@nvn ban ', '');
            if (validate.includes('on')) {
                await this.settingService.updateSetting('CAN_BAN', 'true');
                return {
                    typeFunction: 'ON_BAN',
                    message: 'Đã bật chức năng cấm',
                };
            }
            if (validate.includes('off')) {
                await this.settingService.updateSetting('CAN_BAN', 'false');
                return {
                    typeFunction: 'OFF_BAN',
                    message: 'Đã tắt chức năng cấm',
                };
            }
            // @nvn ban psid reason
            const split: string[] = validate.split(' ');
            const psid: string = split[0];
            if (split.length > 1) {
                const reason: string = validate.replace(psid, '');
                const ban = await this.addBan(psid, reason);
                if (ban) {
                    return {
                        typeFunction: 'ADD_BAN',
                        message: `Đã cấm thành công ${psid}`,
                        senderPsid: psid,
                    };
                } else
                    return {
                        typeFunction: 'ADD_BAN',
                        message: `Tài khoản có psid: ${psid} đã bị cấm`,
                        senderPsid: psid,
                    };
            } else {
                const reason = 'Vi phạm quy định của admin';
                const ban = await this.addBan(psid, reason);
                if (ban) {
                    return {
                        typeFunction: 'ADD_BAN',
                        message: `Đã cấm thành công ${psid}`,
                        senderPsid: psid,
                    };
                } else {
                    return {
                        typeFunction: 'ADD_BAN',
                        message: `Tài khoản có psid: ${psid} đã bị cấm`,
                        senderPsid: psid,
                    };
                }
            }
        }
        if (message.includes('@nvn unban')) {
            //@nvn unban psid
            const psid: string = message.replace('@nvn unban ', '');
            const banDelete = await this.banService.deleteByPsid(psid);
            if (banDelete) {
                return {
                    typeFunction: 'REMOVE_BAN',
                    message: `Đã xóa thành công ${psid}`,
                    senderPsid: psid,
                };
            }
            return {
                typeFunction: 'REMOVE_BAN',
                message: `Không tìm thấy ${psid}`,
            };
        }
        if (message.includes('@nvn bot')) {
            //@nvn bot on or @nvn bot off
            const validate: string = message.replace('@nvn bot ', '');
            if (validate.includes('on')) {
                await this.settingService.updateSetting('BOT_CAN_MESSAGE', 'true');
                return {
                    typeFunction: 'ON_BOT',
                    message: 'Đã bật bot',
                };
            }
            if (validate.includes('off')) {
                await this.settingService.updateSetting('BOT_CAN_MESSAGE', 'false');
                return {
                    typeFunction: 'OFF_BOT',
                    message: 'Đã tắt bot',
                };
            }
        }
        if (message.includes('@nvn font')) {
            //@nvn font on or @nvn font off
            const validate: string = message.replace('@nvn font ', '');
            if (validate.includes('on')) {
                await this.settingService.updateSetting('DOWNLOAD_MULTIPLE_FONT', 'true');
                return {
                    typeFunction: 'ON_DOWNLOAD_MULTIPLE_FONT',
                    message: 'Đã bật chức năng tải nhiều font',
                };
            }
            if (validate.includes('off')) {
                await this.settingService.updateSetting('DOWNLOAD_MULTIPLE_FONT', 'false');
                return {
                    typeFunction: 'OFF_DOWNLOAD_MULTIPLE_FONT',
                    message: 'Đã tắt chức năng tải nhiều font',
                };
            }
        }
        if (message.includes('@nvn list ban')) {
            const listBan = await this.getBanToMessage();
            return {
                typeFunction: 'LIST_BAN',
                message: listBan,
            };
        }
        if (message.includes('@nvn update data')) {
            const updateData = await this.updateDataBySheet();
            await this.init();
            return {
                typeFunction: 'UPDATE_DATA',
                message: updateData,
            };
        }
        if (message.includes('@nvn token')) {
            if (message.includes('update')) {
                const token: string = message.replace('@nvn token update ', '');
                if (token) {
                    await this.settingService.updatePageAccessToken(token);
                    return {
                        typeFunction: 'UPDATE_PAGE_ACCESS_TOKEN',
                        message: 'Đã cập nhật token',
                    };
                } else {
                    return {
                        typeFunction: 'UPDATE_PAGE_ACCESS_TOKEN',
                        message: 'Token không hợp lệ',
                    };
                }
            }
            if (message.includes('show')) {
                const token = await this.settingService.getPageAccessToken();
                return {
                    typeFunction: 'SHOW_PAGE_ACCESS_TOKEN',
                    message: token,
                };
            }
        }
        if (message.includes('@nvn admin')) {
            //@nvn admin add psid or @nvn admin remove psid
            const validate: string = message.replace('@nvn admin ', '');

            if (validate.includes('list')) {
                const listAdmin = await this.getAdminToMessage();
                return {
                    typeFunction: 'LIST_ADMIN',
                    message: listAdmin,
                };
            }
            if (validate.includes('add')) {
                const psid: string = validate.replace('add ', '');
                const admin = await this.adminService.addAdmin(psid);
                if (admin) {
                    await this.updateAdminSenderPsid();
                    return {
                        typeFunction: 'ADD_ADMIN',
                        message: `Đã thêm thành công ${psid}`,
                        senderPsid: psid,
                    };
                } else {
                    return {
                        typeFunction: 'ADD_ADMIN',
                        message: `Tài khoản có psid: ${psid} đã là admin`,
                        senderPsid: psid,
                    };
                }
            }

            if (validate.includes('remove')) {
                await this.updateAdminSenderPsid();
                const psid: string = validate.replace('remove ', '');
                const adminDelete = await this.adminService.deleteByPsid(psid);
                if (adminDelete) {
                    return {
                        typeFunction: 'REMOVE_ADMIN',
                        message: `Đã xóa thành công ${psid}`,
                        senderPsid: psid,
                    };
                }
                return {
                    typeFunction: 'REMOVE_ADMIN',
                    message: `Không tìm thấy ${psid}`,
                };
            }
        }
    }

    public splitBans(bans: Ban[]): Ban[][] {
        const banCheckArray: Ban[][] = [];
        for (let i = 0; i < bans.length; i += 10) {
            banCheckArray.push(bans.slice(i, i + 10));
        }
        return banCheckArray;
    }

    public async checkBan(senderPsid: string): Promise<BanCheck> {
        if (this.adminSenderPsid.includes(senderPsid)) {
            return {
                checkBan: false,
                message: [],
            };
        }
        const ban: Ban = await this.banService.findBySenderPsid(senderPsid);

        if (ban) {
            const stringBan: string[] = [];
            stringBan.push(`Tài khoản của bạn đã bị cấm vì lý do: ${ban.reason}`);
            stringBan.push(`Nếu bạn muốn được hỗ trợ, vui lòng liên hệ với admin qua địa chỉ: m.me/nam077.me`);
            stringBan.push(senderPsid);
            return {
                checkBan: true,
                message: stringBan,
            };
        } else {
            //get giờ viêt nam hiện tại
            const isCanBan: boolean = await this.settingService.getSettingBoolean('CAN_BAN');
            if (isCanBan) {
                const date = new Date();
                date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                const hour = date.getHours();
                if (hour >= 0 && hour <= 5) {
                    const stringBan: string[] = [];
                    const reason = `Nhắn tin quá thời gian quy định`;
                    stringBan.push('Tài khoản của bạn đã bị cấm vì lý do: ' + reason);
                    stringBan.push(`Thời gian hành chính: 5h sáng đến 0h đêm`);
                    stringBan.push(`Nếu bạn muốn được hỗ trợ, vui lòng liên hệ với admin qua địa chỉ: m.me/nam077.me`);
                    stringBan.push(senderPsid);
                    await this.addBan(senderPsid, reason);
                    return {
                        checkBan: true,
                        message: stringBan,
                    };
                }
            }
            return {
                checkBan: false,
                message: null,
            };
        }
    }

    async getPageAccessToken(): Promise<string> {
        return await this.settingService.getPageAccessToken();
    }

    async getIsBotCanMessage() {
        return await this.settingService.getSettingBoolean('BOT_CAN_MESSAGE');
    }

    async removeBanByPsid(senderPsid: string) {
        await this.banService.deleteByPsid(senderPsid);
    }

    async getAllFont(): Promise<Font[]> {
        return await this.fontService.findAll();
    }

    getPaginateFontList(): FontPageList {
        return {
            allPage: Math.ceil(this.fonts.length / 10),
            fontPages: this.chunkFontPage(10),
        };
    }

    chunkFontPage(size: number): FontPage[] {
        const fontPage: FontPage[] = [];
        for (let i = 0; i < this.fonts.length; i += size) {
            fontPage.push({
                fonts: this.fonts.slice(i, i + size),
                page: i / size + 1,
            });
        }
        return fontPage;
    }

    async apiTalk(message: string): Promise<string> {
        return await this.crawlerService.apiTalk(message);
    }

    private async addBan(senderPsid: string, reason: string): Promise<Ban> {
        return await this.banService.addBan({
            senderPsid: senderPsid,
            reason: reason,
            name: 'Không có',
        });
    }

    private async getBanToMessage(): Promise<string[]> {
        const bans: Ban[] = await this.banService.findAll();
        if (bans.length == 0) {
            return ['Chưa có tài khoản nào bị cấm'];
        }
        const splitBans: Ban[][] = this.splitBans(bans);
        const stringBans: string[] = [];
        let stringBan = 'Danh sách tài khoản bị cấm: \n\n';
        splitBans.forEach((ban: Ban[]) => {
            ban.forEach((ban: Ban) => {
                stringBan += `Tên: ${ban.name} \n Psid: ${ban.senderPsid} \n\n`;
            });
            stringBans.push(stringBan);
            stringBan = '';
        });

        return stringBans;
    }

    private async getAdminToMessage() {
        if (this.adminSenderPsid.length == 0) {
            return ['Chưa có admin nào'];
        }
        const stringAdmins: string[] = [];
        let stringAdmin = 'Danh sách admin: \n\n';
        this.adminSenderPsid.forEach((admin: string) => {
            stringAdmin += `Psid: ${admin} \n\n`;
        });
        stringAdmins.push(stringAdmin);
        return stringAdmins;
    }

    async getRandomFood(): Promise<Food> {
        return await this.foodService.getRandomFood();
    }
}

export interface DataChat {
    fonts: Font[];
    responses: Response[];
}

export interface BanCheck {
    checkBan: boolean;
    message: string[];
}

export interface AdminFunction {
    typeFunction: AdminFunctionType;
    message: string | string[];
    senderPsid?: string;
}

type AdminFunctionType =
    | 'ON_BAN'
    | 'OFF_BAN'
    | 'ADD_BAN'
    | 'REMOVE_BAN'
    | 'ON_DOWNLOAD_MULTIPLE_FONT'
    | 'OFF_DOWNLOAD_MULTIPLE_FONT'
    | 'ON_BOT'
    | 'LIST_BAN'
    | 'OFF_BOT'
    | 'UPDATE_DATA'
    | 'SHOW_PAGE_ACCESS_TOKEN'
    | 'UPDATE_PAGE_ACCESS_TOKEN'
    | 'ADD_ADMIN'
    | 'LIST_ADMIN'
    | 'REMOVE_ADMIN';

export interface FontPage {
    page?: number;
    fonts: Font[];
}

export interface FontPageList {
    allPage: number;
    fontPages: FontPage[];
}
