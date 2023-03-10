import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Font } from '../font/entities/font.entity';
import { AdminFunction, BanCheck, ChatService, DataChat, FontPageList } from '../chat/chat.service';
import { CrawDataGoogle, CrawDataLucky, CrawDataYoutube, CrawlerCovid } from '../chat/crawler/crawler.service';
import { Food } from '../food/entities/food.entity';

@Injectable()
export class MessengerService {
    private pageAccessToken: string;
    private apiVersion = 'v15.0';
    private headers;
    private verifyToken = 'nam077';
    private isBotCanMessage: boolean;
    private senderPsidAdmin: string[];
    private senderPsidOffBot: string[] = [];
    private senderUsingChatGPT: string[] = [];

    constructor(private readonly httpService: HttpService, private readonly chatService: ChatService) {
        new Promise<void>(async () => {
            await this.init();
        }).then(() => console.log('Messenger service is ready!'));
    }

    addSenderPsidOffBot(senderPsid: string): void {
        this.senderPsidOffBot.push(senderPsid);
    }

    removeSenderPsidOffBot(senderPsid: string): void {
        this.senderPsidOffBot.splice(this.senderPsidOffBot.indexOf(senderPsid), 1);
    }

    addSenderUsingChatGPT(senderPsid: string): void {
        this.senderUsingChatGPT.push(senderPsid);
    }

    removeSenderUsingChatGPT(senderPsid: string): void {
        this.senderUsingChatGPT.splice(this.senderUsingChatGPT.indexOf(senderPsid), 1);
    }

    getWebHook(mode: string, challenge: string, verifyToken: string) {
        if (mode && verifyToken === this.verifyToken) {
            return challenge;
        }
        throw new ForbiddenException("Can't verify token");
    }

    public async init() {
        this.isBotCanMessage = await this.chatService.getIsBotCanMessage();
        this.senderPsidAdmin = await this.chatService.getAllAdmins();
        this.pageAccessToken = await this.chatService.getPageAccessToken();
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.pageAccessToken}`,
        };
    }

    public async updatePageAccessTokenAndHeaders() {
        this.pageAccessToken = await this.chatService.getPageAccessToken();
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.pageAccessToken}`,
        };
    }

    public async updateIsBotCanMessage() {
        this.isBotCanMessage = await this.chatService.getIsBotCanMessage();
    }

    public async updateSenderPsidAdmin() {
        this.senderPsidAdmin = await this.chatService.getAllAdmins();
    }

    async sendTextMessage(senderPsid, text) {
        const response = {
            text,
        };
        await this.callSendAPI(senderPsid, response);
    }

    async sendImageMessage(senderPsid, imageUrl) {
        const response = {
            attachment: {
                type: 'image',
                payload: {
                    url: imageUrl,
                },
            },
        };
        await this.callSendAPI(senderPsid, response);
    }

    async callSendAPI(senderPsid, response): Promise<void> {
        const requestBody = {
            recipient: {
                id: senderPsid,
            },
            message: response,
        };
        await this.sendMarkSeen(senderPsid);
        await this.sendTypingOn(senderPsid);
        try {
            await this.httpService
                .post(`https://graph.facebook.com/${this.apiVersion}/me/messages`, requestBody, {
                    headers: this.headers,
                })
                .toPromise()
                .catch();
        } catch (e) {
            console.log("Can't send message!");
        } finally {
            await this.sendTypingOff(senderPsid);
        }
    }

    async sendTypingOn(senderPsid): Promise<void> {
        const requestBody = {
            recipient: {
                id: senderPsid,
            },
            sender_action: 'typing_on',
        };
        return new Promise(async (resolve, reject) => {
            await this.httpService
                .post(`https://graph.facebook.com/${this.apiVersion}/me/messages`, requestBody, {
                    headers: this.headers,
                })
                .toPromise()
                .then(() => resolve())
                .catch(() => reject());
        });
    }

    async sendGreetings(senderPsid: string, userProfile: UserProfile): Promise<void> {
        this.removeSenderPsidOffBot(senderPsid);
        await this.sendTextMessage(senderPsid, senderPsid);
        await this.sendGreeting(senderPsid, userProfile);
        await this.sendImageMessage(senderPsid, userProfile.profile_pic);
        await this.sendQuickRepliesGreeting(senderPsid, userProfile);
    }

    async sendQuickRepliesGreeting(senderPsid: string, userProfile: UserProfile) {
        const quick_replies = [
            {
                content_type: 'text',
                title: '???? Mua t???ng h???p font',
                payload: 'BUY_FONT',
            },
            {
                content_type: 'text',
                title: '???? H?????ng d???n s??? d???ng',
                payload: 'HOW_TO_USE',
            },
            {
                content_type: 'text',
                title: '???? Danh s??ch font',
                payload: 'LIST_FONT_IMAGE',
            },
        ]; //
        const message = `B???n mu???n m??nh gi??p g?? n??o ${userProfile.name}?`;
        await this.sendQuickReply(senderPsid, message, quick_replies);
    }

    async sendTypingOff(senderPsid): Promise<void> {
        const requestBody = {
            recipient: {
                id: senderPsid,
            },
            sender_action: 'typing_off',
        };
        try {
            return new Promise(async (resolve, reject) => {
                await this.httpService
                    .post(`https://graph.facebook.com/${this.apiVersion}/me/messages`, requestBody, {
                        headers: this.headers,
                    })
                    .toPromise()
                    .then(() => resolve())
                    .catch(() => reject());
            });
        } catch (e) {
            console.log("Can't send typing off!");
        }
    }

    async sendMarkSeen(senderPsid): Promise<void> {
        const requestBody = {
            recipient: {
                id: senderPsid,
            },
            sender_action: 'mark_seen',
        };
        try {
            return new Promise(async (resolve, reject) => {
                await this.httpService
                    .post(`https://graph.facebook.com/${this.apiVersion}/me/messages`, requestBody, {
                        headers: this.headers,
                    })
                    .toPromise()
                    .then(() => resolve())
                    .catch(() => reject());
            });
        } catch (e) {
            console.log("Can't send mark seen!");
        }
    }

    async getUserProfile(senderPsid): Promise<UserProfile> {
        try {
            const response = await this.httpService
                .get(`https://graph.facebook.com/${this.apiVersion}/${senderPsid}`, {
                    params: {
                        fields: 'first_name,last_name,profile_pic,id,name',
                        access_token: this.pageAccessToken,
                    },
                })
                .toPromise();
            if (response.data) {
                return response.data;
            }
        } catch (e) {
            return {
                first_name: 'b???n',
                last_name: '',
                profile_pic: 'https://i.pinimg.com/originals/e0/bf/18/e0bf18ff384586f1b0c1fe7105e859b1.gif',
                id: senderPsid,
                name: 'b???n',
            };
        }
    }

    async setGetStartedButton() {
        const requestBody = {
            get_started: {
                payload: 'GET_STARTED',
            },
            greeting: [
                {
                    locale: 'default',
                    text: 'Xin ch??o b???n ???? ?????n v???i NVN Font! b???n c?? th??? g???i tin nh???n cho NVN Font ????? s??? d???ng bot m???t c??ch mi???n ph??!',
                },
                {
                    locale: 'en_US',
                    text: 'Hi, welcome to NVN Font! You can send message to NVN Font to use bot for free!',
                },
            ],
        };
        try {
            await this.httpService.post(
                `https://graph.facebook.com/${this.apiVersion}/me/messenger_profile`,
                requestBody,
                {
                    headers: this.headers,
                },
            );
        } catch (e) {
            console.log("Can't set get started button!");
        }
    }

    public async setPersistentMenu() {
        //using axios to send message to facebook
        try {
            await this.httpService
                .post(
                    'https://graph.facebook.com/v9.0/me/messenger_profile',
                    {
                        persistent_menu: [
                            {
                                locale: 'default',
                                composer_input_disabled: false,
                                call_to_actions: [
                                    {
                                        type: 'postback',
                                        title: '???? Kh???i ?????ng l???i bot',
                                        payload: 'RESTART_BOT',
                                    },
                                    {
                                        type: 'postback',
                                        title: '??? T???t bot',
                                        payload: 'TOGGLE_BOT',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Chat GPT',
                                        payload: 'CHAT_GPT',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Mua t???ng h???p font',
                                        payload: 'BOT_BUY',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Xem c??c font m???i nh???t',
                                        payload: 'LIST_FONT_IMAGE_END',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Danh s??ch font',
                                        payload: 'LIST_FONT',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Xem Demo Danh S??ch Font',
                                        payload: 'LIST_FONT_IMAGE',
                                    },
                                    {
                                        type: 'web_url',
                                        title: '???? Tham gia nh??m',
                                        url: 'https://www.facebook.com/groups/NVNFONT/',
                                        webview_height_ratio: 'full',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? H?????ng d???n s??? d???ng bot',
                                        payload: 'HOW_TO_USE',
                                    },
                                    {
                                        type: 'postback',
                                        title: '???? Xem gi?? vi???t h??a',
                                        payload: 'PRICE_SERVICE',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.pageAccessToken,
                        },
                    },
                )
                .toPromise();
        } catch (error) {
            console.log('Error when set up persistent menu');
        } finally {
            console.log('Set up persistent menu success');
        }
    }

    async postWebHook(body: any) {
        try {
            if (body.object == 'page') {
                for (const entry of body.entry) {
                    const webhook_event = entry.messaging[0];
                    console.log(webhook_event);
                    const senderPsid = webhook_event.sender.id;
                    console.log('Sender PSID: ' + senderPsid);
                    const date = new Date(webhook_event.timestamp);
                    console.log('Date: ' + date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }));
                    const banCheck: BanCheck = await this.chatService.checkBan(senderPsid);
                    if (banCheck.checkBan) {
                        for (const msg of banCheck.message) {
                            await this.sendTextMessage(senderPsid, msg);
                        }
                        return;
                    }
                    if (this.isBotCanMessage || this.senderPsidAdmin.includes(senderPsid)) {
                        if (webhook_event.message && webhook_event.message.quick_reply) {
                            await this.handleQuickReply(senderPsid, webhook_event.message.quick_reply);
                        }
                        if (webhook_event.message) {
                            if (webhook_event.message.text && !this.senderPsidOffBot.includes(senderPsid)) {
                                await this.handleMessage(senderPsid, webhook_event.message);
                            }
                            if (webhook_event.message.attachments) {
                                // await this.handleAttachment(sender_psid, webhook_event.message);
                            }
                        } else if (webhook_event.postback) {
                            await this.handlePostback(senderPsid, webhook_event.postback);
                        }
                    }
                }
                return 'EVENT_RECEIVED';
            }
        } catch {}
    }

    async handleResponseAndFont(senderPsid: string, message: string, userProfile: UserProfile): Promise<string> {
        const data: DataChat = await this.chatService.getFontAndResponse(message);
        if (data.fonts.length > 0) {
            if (data.fonts.length == 1) {
                await this.sendSingleFont(senderPsid, data.fonts[0], userProfile);
                return 'singleFont';
            }
            if (data.fonts.length <= 10) {
                await this.sendListFontTemplate(senderPsid, data.fonts, userProfile);
                return 'listFont';
            }

            if (data.fonts.length > 10) {
                await this.sendListFontText(senderPsid, data.fonts, userProfile);
                return 'listFont';
            }
        }
        if (data.responses.length > 0) {
            const response = data.responses[Math.floor(Math.random() * data.responses.length)];
            const message = this.validateMessage(
                response.messages[Math.floor(Math.random() * response.messages.length)].value,
                userProfile,
            );
            await this.sendTextMessage(senderPsid, message);
            if (response.images.length > 0) {
                const image = response.images[Math.floor(Math.random() * response.images.length)];
                await this.sendImageMessage(senderPsid, image.url);
            }
            return 'response';
        }
        return null;
    }

    public async sendGenericMessage(senderPsid: string, elements: any) {
        // Create the payload for a basic text message
        try {
            const response = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: elements,
                    },
                },
            }; //
            await this.callSendAPI(senderPsid, response);
        } catch (error) {
            return;
        }
    }

    async test(senderPsid: string) {
        console.log(senderPsid);
        await this.sendTextMessage(senderPsid, '??ang x??? l??...');
    }

    async getInfo(id: string) {
        return await this.getUserProfile(id);
    }

    //
    async setUp() {
        await this.setGetStartedButton();
        await this.setPersistentMenu();
        return 'C??i ?????t th??nh c??ng';
    }

    public getResponseFont(font: Font, userProfile: UserProfile): any {
        const validateMessage = this.validateMessage(
            font.messages[Math.floor(Math.random() * font.messages.length)].value,
            userProfile,
        );
        const message = `Ch??o ${userProfile.name}\nT??i ???? nh???n ???????c y??u c???u t??? b???n\nT??n font: ${
            font.name
        }\nLink download: ${font.links[Math.floor(Math.random() * font.links.length)].url}\n${validateMessage}`;

        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: message,
                    buttons: [
                        {
                            type: 'web_url',
                            url: font.links[Math.floor(Math.random() * font.links.length)].url,
                            title: 'T???i xu???ng',
                        },
                        {
                            type: 'postback',
                            title: 'Font kh??c',
                            payload: 'LIST_FONT',
                        },
                    ],
                },
            },
        };
    }

    public async sendGreeting(senderPsid: string, userProfile: UserProfile) {
        const date = new Date();
        date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const hour = date.getHours();
        if (hour >= 5 && hour < 10) {
            await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, ch??c b???n m???t bu???i s??ng t???t l??nh!`);
        } else if (hour >= 10 && hour <= 12) {
            await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, b???n ???? ??n tr??a ch??a?`);
        } else if (hour > 12 && hour < 18) {
            await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, ch??c b???n m???t bu???i chi???u t???t l??nh!`);
        } else if (hour >= 18 && hour < 22) {
            await this.sendTextMessage(
                senderPsid,
                `Ch??o ${userProfile.name}, ch??c b???n m???t bu???i t???i t???t l??nh, b???n ???? ??n t???i ch??a?`,
            );
        } else if (hour >= 22 && hour < 24) {
            await this.sendTextMessage(
                senderPsid,
                `Ch??o ${userProfile.name}, khuya r???i l??m vi???c ??t th??i n??, ??i ng??? ??i!`,
            );
        } else if (hour >= 0 && hour < 5) {
            await this.sendTextMessage(
                senderPsid,
                `Ch??o ${userProfile.name}, N???u b???n nh???n tin gi??? n??y th?? ??ang l??m phi???n m??nh ????y kh??ng n??n nh??!`,
            );
        }
    }

    public async sendListFont(senderPsid: string, userProfile: UserProfile) {
        const listFonts = this.chatService.getListFont();
        for (const listFont of listFonts) {
            await this.sendTextMessage(senderPsid, listFont.value);
        }
        const message =
            `Ch??o ${userProfile.name}\n????y l?? danh s??ch font ??ang c?? tr??n h??? th???ng\n` +
            `B???n c?? th??? t???i xu???ng b???ng c??ch nh???n tin theo c?? ph??p: T??i mu???n t???i font <t??n font>\n` +
            `V?? d???: T??i mu???n t???i font NVN Parka\n`;
        await this.sendTextMessage(senderPsid, message);
        return;
    }

    async sendButtonNextPage(senderPsid: string, userProfile: UserProfile, page: number) {
        const message = `Ch??o ${userProfile.name}\n????y l?? trang ${page} c???a danh s??ch font`;
        const response = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: message,
                    buttons: [
                        {
                            type: 'postback',
                            title: 'Trang ti???p theo ????',
                            payload: `LIST_FONT_IMAGE ${page + 1}`,
                        },
                    ],
                },
            },
        };
        await this.callSendAPI(senderPsid, response);
    }

    async apiTalk(message: string): Promise<string> {
        return await this.chatService.apiTalk(message);
    }

    async sendAllFunction(senderPsid: string, userProfile: UserProfile) {
        const string =
            `Ch??o ${userProfile.name}\n` +
            `T??i l?? bot h??? tr??? t???i font ch??? mi???n ph??\n` +
            `-------------------------\n` +
            `B???n c?? th??? t??m ki???m font ch??? theo t??n ho???c t???i font ch??? theo t??n\n` +
            `V?? d???: T??i mu???n t???i font <t??n font>\n` +
            `-------------------------\n` +
            `B???n c?? th??? t??m ki???m video theo t??n\n` +
            `@ytb <t??n video>\n` +
            `V?? d???: @ytb ??m th???m b??n em\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i k???t qu??? x??? s???\n` +
            `V?? d???: @xsmb\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i th??ng tin covid\n` +
            `@covid <t??n qu???c gia>\n` +
            `V?? d???: @covid Vi???t Nam\n` +
            `-------------------------\n` +
            `B???n c?? th??? l???y s??? may m???n\n` +
            `@lucky min=<s??? nh??? nh???t> max=<s??? l???n nh???t>\n get=<s??? l?????ng s???>\n` +
            `V?? d???: @lucky min=1 max=100 get=5\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i bot ??n g?? h??m nay\n` +
            `V?? d???: H??m nay ??n g??\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i th???i ti???t theo ?????a ??i???m\n` +
            `V?? d???: Th???i ti???t <?????a ??i???m>\n` +
            `V?? d???: Th???i ti???t H?? N???i\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i th??ng tin c?? b???n\n` +
            `V?? d???: T???i sao l?? c??y l???i c?? m??u xanh ?\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i t??? s??? b??ng ????\n` +
            `V?? d???: T??? s??? b??ng ???? Vi???t Nam - Th??i Lan\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i ng??y sinh ng??y l???, v?? nhi???u th??? kh??c\n` +
            `V?? d???: Ng??y sinh c???a Ronaldo\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i gi?? v???t gi??, ti???n, bitcoin\n` +
            `V?? d???: Gi?? bitcoin\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i ?????nh ngh??a\n` +
            `V?? d???: ?????nh ngh??a c???a t??nh y??u\n` +
            `-------------------------\n` +
            `B???n c?? th??? chuy???n ?????i ????n v???\n` +
            `V?? d???: 3 t???n b???ng bao nhi??u kg\n` +
            `-------------------------\n` +
            `B???n c?? th??? chuy???n ?????i ti???n t???\n` +
            `V?? d???: 3000 $ b???ng bao nhi??u ?????ng\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i lyric b??i h??t\n` +
            `Lyric  <t??n b??i h??t>\n` +
            `V?? d???: Lyric C?? h???n v???i thanh xu??n\n` +
            `-------------------------\n` +
            `B???n c?? th??? h???i ki???n th???c l???ch s???, ?????a l?? v?? v?? v??n ch??? ????? kh??c\n` +
            `V?? d???: Chi???n d???ch ??i???n Bi??n Ph??? ng??y th??ng n??m n??o ?\n` +
            `V?? d???: ?????a l?? Vi???t Nam c?? bao nhi??u t???nh ?\n` +
            `-------------------------\n`;
        return await this.sendTextMessage(senderPsid, string);
    }

    private async handlePostback(senderPsid: string, receivedPostback: any) {
        const userProfile: UserProfile = await this.getUserProfile(senderPsid);
        const payload = receivedPostback.payload;
        const handle = await this.handleResponseAndFont(senderPsid, payload, userProfile);
        if (handle) return;
        switch (payload) {
            case 'GET_STARTED_PAYLOAD':
                await this.sendGreetings(senderPsid, userProfile);
                break;
            case 'RESTART_BOT':
                await this.sendGreetings(senderPsid, userProfile);
                break;
            case 'BOT_BUY':
                await this.sendBuyFont(senderPsid, userProfile);
                break;
            case 'LIST_FONT_IMAGE_END':
                await this.sendListFontImage(senderPsid, userProfile, payload, 'end');
                return;
            case 'LIST_FONT':
                await this.sendListFont(senderPsid, userProfile);
                break;
            case 'CHAT_GPT':
                await this.sendQuickReplyChatGPT(senderPsid, userProfile);
                break;
            case 'HOW_TO_USE':
                await this.sendAllFunction(senderPsid, userProfile);
                break;
            case 'PRICE_SERVICE':
                await this.sendServicePrice(senderPsid, userProfile);
                break;
            case 'TOGGLE_BOT':
                await this.sendQuickReplyToggleBot(senderPsid, userProfile);
                break;
            default:
                break;
        }
        if (payload.includes('LIST_FONT_IMAGE')) {
            await this.sendListFontImage(senderPsid, userProfile, payload);
            return;
        }
    }

    private async handleMessage(senderPsid: string, receivedMessage: ReceivedMessage) {
        const userProfile = await this.getUserProfile(senderPsid);
        const message = receivedMessage.text;
        if (this.senderUsingChatGPT.includes(senderPsid)) {
            const dataChatGPT = await this.chatService.getChatGPT(message);
            await this.sendTextMessage(senderPsid, dataChatGPT);
            return;
        }
        if (message.toLowerCase().includes('h?????ng d???n s??? d???ng')) {
            await this.sendAllFunction(senderPsid, userProfile);
            return;
        }

        if (message.toLowerCase().includes('b???t ?????u')) {
            await this.sendGreetings(senderPsid, userProfile);
            return;
        }

        if (message.toLowerCase().includes('??n g??' || 'm??n g??' || 'm??n ??n' || 'm??n ??n g??' || 'm??n kh??c')) {
            await this.sendFood(senderPsid, userProfile);
            return;
        }

        if (message.includes('@lucky')) {
            const lucky: CrawDataLucky = await this.chatService.getLuckNumber(message);
            await this.sendTextMessage(senderPsid, lucky.title);
            return;
        }

        if (message.includes('@nvn')) {
            if (this.senderPsidAdmin.includes(senderPsid)) {
                const adminFunction: AdminFunction = await this.chatService.functionAdmin(senderPsid, message);
                if (adminFunction.typeFunction.includes('REMOVE_ADMIN' || 'ADD_ADMIN')) {
                    await this.updateSenderPsidAdmin();
                    return;
                }
                if (adminFunction.typeFunction.includes('ON_BOT' || 'OFF_BOT')) {
                    await this.updateIsBotCanMessage();
                    return;
                }
                if (adminFunction.typeFunction.includes('ADD_BAN')) {
                    const userProileByPsid: UserProfile = await this.getUserProfile(adminFunction.senderPsid);
                    if (userProileByPsid) {
                        await this.chatService.updateBanName(userProileByPsid.id, userProileByPsid.name);
                        await this.sendTextMessage(
                            senderPsid,
                            '???? ch???n th??nh c??ng ng?????i d??ng: ' + userProileByPsid.name + '!',
                        );
                        await this.sendTextMessage(adminFunction.senderPsid, 'B???n ???? b??? ch???n kh???i bot!');
                        return;
                    } else {
                        await this.chatService.removeBanByPsid(adminFunction.senderPsid);
                        await this.sendTextMessage(senderPsid, 'Kh??ng t??m th???y ng?????i d??ng!');
                        return;
                    }
                }
                if (adminFunction.typeFunction.includes('REMOVE_BAN')) {
                    if (adminFunction.senderPsid) {
                        await this.chatService.removeBanByPsid(adminFunction.senderPsid);
                        await this.sendTextMessage(senderPsid, '???? b??? ch???n th??nh c??ng!');
                        await this.sendTextMessage(adminFunction.senderPsid, 'B???n ???? ???????c b??? ch???n!');
                        await this.sendTextMessage(adminFunction.senderPsid, adminFunction.senderPsid);
                        return;
                    } else {
                        await this.sendTextMessage(senderPsid, adminFunction.message);
                    }
                }
                if (adminFunction.typeFunction === 'UPDATE_PAGE_ACCESS_TOKEN') {
                    await this.updatePageAccessTokenAndHeaders();
                    await this.sendTextMessage(senderPsid, adminFunction.message);
                    return;
                }
                if (adminFunction.typeFunction.includes('LIST_BAN' || 'LIST_ADMIN')) {
                    for (const msg of adminFunction.message) {
                        await this.sendTextMessage(senderPsid, msg);
                    }
                    return;
                } else await this.sendTextMessage(senderPsid, adminFunction.message);

                return;
            }
            await this.sendTextMessage(senderPsid, 'B???n kh??ng c?? quy???n s??? d???ng l???nh n??y!');
            return;
        }
        if (message.includes('@xsmb')) {
            const xsmb: string = await this.chatService.getDataXoSo();
            await this.sendTextMessage(senderPsid, xsmb);
            return;
        }
        if (message.includes('@ytb')) {
            const ytb: CrawDataYoutube[] = await this.chatService.getDataCrawlerYoutube(message);
            await this.sendMultiYoutubeMessage(senderPsid, ytb);
            return;
        }
        const handle = await this.handleResponseAndFont(senderPsid, message, userProfile);
        if (handle) return;
        if (message.includes('@covid')) {
            const covid: CrawlerCovid = await this.chatService.getDataCrawlerCovid(message);
            if (covid.type === 'singleLocation') {
                await this.sendTextMessage(senderPsid, covid.data);
                return;
            }
            if (covid.type === 'allLocation') {
                await this.sendTextMessage(senderPsid, covid.data);
                await this.sendTextMessage(senderPsid, '????y l?? d??? li???u t???ng h???p c??c ca b???nh tr??n to??n th??? gi???i');
                await this.sendTextMessage(
                    senderPsid,
                    `N???u b???n mu???n xem d??? li???u chi ti???t h??y nh???p @covid t???i <Qu???c gia> `,
                );
                await this.sendTextMessage(senderPsid, 'V?? d???: @covid t???i Vi???t Nam');
                return;
            }
            return;
        } else {
            const crawlerGoogles: CrawDataGoogle[] = await this.chatService.getDataCrawlerGoogle(message);
            if (crawlerGoogles.length > 0) {
                const crawlerGoogle = crawlerGoogles[0];
                if (typeof crawlerGoogle.data === 'string') {
                    await this.sendTextMessage(senderPsid, crawlerGoogle.data);
                    return;
                }
                if (crawlerGoogle.data instanceof Array) {
                    await this.sendMultiTextMessage(senderPsid, crawlerGoogle.data);
                    return;
                }

                return;
            } else {
                return;
            }
        }
    }

    private async sendMultiYoutubeMessage(senderPsid: string, ytb: CrawDataYoutube[]) {
        const elements: any[] = [];
        for (const item of ytb) {
            elements.push({
                title: item.title,
                image_url: item.thumbnail || 'https://picsum.photos/600/40' + Math.floor(Math.random() * 10),
                subtitle: item.duration,
                default_action: {
                    type: 'web_url',
                    url: item.url || 'fb.com/nvnfont',
                    webview_height_ratio: 'tall',
                },
                buttons: [
                    {
                        type: 'web_url',
                        title: 'Xem Video',
                        url: item.url || 'fb.com/nvnfont',
                    },
                ],
            });
        }
        await this.sendGenericMessage(senderPsid, elements);
    }

    private async handleQuickReply(senderPsid: string, receivedQuickReply: ReceivedQuickReply) {
        const userProfile = await this.getUserProfile(senderPsid);
        const payload = receivedQuickReply.payload;
        switch (payload) {
            case 'ON_BOT':
                await this.sendTextMessage(senderPsid, 'B???n ???? b???t bot!');
                await this.removeSenderPsidOffBot(senderPsid);
                break;
            case 'OFF_BOT':
                await this.sendTextMessage(senderPsid, 'B???n ???? t???t bot!');
                await this.addSenderPsidOffBot(senderPsid);
                break;
            case 'BUY_FONT':
                await this.sendBuyFont(senderPsid, userProfile);
                break;
            case 'LIST_FONT_IMAGE':
                await this.sendListFontImage(senderPsid, userProfile, payload);
                break;
            case 'HOW_TO_USE':
                await this.sendAllFunction(senderPsid, userProfile);
                break;
            case 'ON_CHAT_GPT':
                await this.sendTextMessage(senderPsid, 'B???n ???? b???t chat GPT!');
                await this.removeSenderUsingChatGPT(senderPsid);
                break;
            case 'OFF_CHAT_GPT':
                await this.sendTextMessage(senderPsid, 'B???n ???? t???t chat GPT!');
                await this.addSenderUsingChatGPT(senderPsid);
                break;
            default:
                break;
        }
        return;
    }

    private async handleAttachment(senderPsid: any, receivedAttachment: ReceivedAttachment) {
        const url = receivedAttachment.attachments[0].payload.url;
        const user = await this.getUserProfile(senderPsid);
        await this.sendTextMessage(senderPsid, `Ch??o b???n ${user.name}! b???n ???? g???i ???nh: ${url}`);
        await this.sendImageMessage(senderPsid, url);
    }

    private async sendAttachmentMessage(recipientId: string, attachment: Attachment) {
        const response = {
            attachment,
        };
        await this.callSendAPI(recipientId, response);
    }

    private validateMessage(message: string, userProfile: UserProfile) {
        if (message.includes('{{name}}')) {
            message = message.replace(/{{name}}/g, userProfile.name);
        }
        if (message.includes('{{first_name}}')) {
            message = message.replace(/{{first_name}}/g, userProfile.first_name);
        }
        if (message.includes('{{last_name}}')) {
            message = message.replace(/{{last_name}}/g, userProfile.last_name);
        }
        if (message.includes('{{profile_pic}}')) {
            message = message.replace(/{{profile_pic}}/g, userProfile.profile_pic);
        }
        if (message.includes('{{id}}')) {
            message = message.replace(/{{id}}/g, userProfile.id);
        }
        return message;
    }

    private async sendSingleFont(senderPsid: string, font: Font, userProfile: UserProfile) {
        await this.sendImageMessage(senderPsid, font.images[Math.floor(Math.random() * font.images.length)].url);
        const response = this.getResponseFont(font, userProfile);
        await this.callSendAPI(senderPsid, response);
    }

    private async sendListFontTemplate(senderPsid: string, fonts: Font[], userProfile: UserProfile, type?: string) {
        const elements: any[] = [];
        for (const font of fonts) {
            elements.push({
                title: font.name,
                image_url: font.images[Math.floor(Math.random() * font.images.length)].url,
                subtitle: font.description,
                default_action: {
                    type: 'web_url',
                    url: font.urlPost,
                    webview_height_ratio: 'tall',
                },
                buttons: type === 'payload' ? this.getButtonsPayloadFont(font) : this.getButtonLinkFont(font),
            });
        }
        await this.sendGenericMessage(senderPsid, elements);
    }

    private getButtonLinkFont(font: Font) {
        const buttons: any[] = [];
        for (let i = 0; i < font.links.length && i < 3; i++) {
            buttons.push({
                type: 'web_url',
                url: font.links[i].url,
                title: 'Link ' + (i + 1),
            });
        }
        return buttons;
    }

    private async sendListFontText(senderPsid: string, fonts: Font[], userProfile: UserProfile) {
        const dataFont: string[] = this.getTextFromFonts(fonts);
        const message = `Ch??o ${userProfile.name}\nT??i ???? nh???n ???????c y??u c???u t??? b???n\nB???n c?? th??? t???i font theo link b??n d?????i\n`;
        await this.sendTextMessage(senderPsid, message);
        const chunkFont = this.chunkArray(dataFont, 10);
        for (const chunk of chunkFont) {
            await this.sendTextMessage(senderPsid, chunk.join('\n\n'));
        }
        return;
    }

    private getTextFromFonts(fonts: Font[]) {
        const dataFont: string[] = [];
        for (const font of fonts) {
            dataFont.push(
                `T??n font: ${font.name}\nLink download: ${
                    font.links[Math.floor(Math.random() * font.links.length)].url
                }`,
            );
        }
        return dataFont; //
    }

    private chunkArray(myArray: any[], chunk_size: number): any[][] {
        const results = [];
        for (let i = 0; i < myArray.length; i += chunk_size) {
            results.push(myArray.slice(i, i + chunk_size));
        }
        return results;
    }

    private async sendQuickReplyToggleBot(senderPsid: string, userProfile: UserProfile) {
        if (this.senderPsidOffBot.includes(senderPsid)) {
            const message = `Ch??o ${userProfile.name}\nB???n ???? t???t bot, b???n c?? mu???n b???t l???i bot kh??ng?`;
            const quickReplies = [
                {
                    content_type: 'text',
                    title: '???? B???t bot',
                    payload: 'ON_BOT',
                },
            ];
            await this.sendQuickReply(senderPsid, message, quickReplies);
        } else {
            const message = `Ch??o ${userProfile.name}\nB???n ???? b???t bot, b???n c?? mu???n t???t bot kh??ng?`;
            const quickReplies = [
                {
                    content_type: 'text',
                    title: '???? T???t bot',
                    payload: 'OFF_BOT',
                },
            ];
            await this.sendQuickReply(senderPsid, message, quickReplies);
        }
    }

    private async sendQuickReply(senderPsid: string, message: string, quickReplies: any) {
        const response = {
            text: message,
            quick_replies: quickReplies,
        };
        await this.callSendAPI(senderPsid, response);
    }

    private async sendListFontImage(senderPsid: string, userProfile: UserProfile, payload: string, type?: string) {
        const fontPageList: FontPageList = this.chatService.getPaginateFontList();
        if (type) {
            await this.sendListFontTemplate(
                senderPsid,
                fontPageList.fontPages[fontPageList.fontPages.length - 1].fonts,
                userProfile,
                'payload',
            );
            return;
        }
        // payload = LIST_FONT_IMAGE or LIST_FONT_IMAGE <page>
        const page = payload.split(' ').length > 1 ? parseInt(payload.split(' ')[1]) : 1;
        if (!page) {
            const fonts = fontPageList.fontPages[0].fonts;
            await this.sendListFontTemplate(senderPsid, fonts, userProfile, 'payload');
            await this.sendButtonNextPage(senderPsid, userProfile, 1);
            return;
        } else if (page > fontPageList.fontPages.length) {
            await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, danh s??ch font ???? h???t`);
            return;
        }
        const fonts = fontPageList.fontPages[page - 1].fonts;
        await this.sendListFontTemplate(senderPsid, fonts, userProfile, 'payload');
        if (page < fontPageList.fontPages.length) {
            await this.sendButtonNextPage(senderPsid, userProfile, page);
        } else await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, danh s??ch font ???? h???t`);
        return;
    }

    private getButtonsPayloadFont(font: Font) {
        return [
            {
                type: 'postback',
                title: 'T???i xu???ng',
                payload: font.keys ? font.keys[Math.floor(Math.random() * font.keys.length)].value : font.name,
            },
        ];
    }

    private async sendBuyFont(senderPsid: string, userProfile: UserProfile) {
        const message =
            `Ch??o ${userProfile.name}\n` +
            `Hi???n t???i b??n m??nh ??ang b??n t???ng c???ng 5100 font ch???\n` +
            `v???i gi?? 250.000?? cho 1 b??? font ch???\n`;
        const contact = `Li???n h??? v???i admin qua:\n` + `Facebook: fb.com/nam077.me\n`;
        await this.sendTextMessage(senderPsid, message);
        await this.sendTextMessage(senderPsid, contact);
    }

    private async sendServicePrice(senderPsid: string, userProfile: UserProfile) {
        const message =
            `Ch??o ${userProfile.name}\n` +
            `Hi???n t???i b??n m??nh ??ang b??n d???ch v???:\n` +
            `1. V???t ho?? font ch???: 100.000??\n` +
            `2. Ch???nh s???a font vi???t ho??: 50-100.000??\n` +
            `3. T???o chatbot: th????ng l?????ng\n`;
        const contact = `Li???n h??? v???i admin qua:\n` + `Facebook: fb.com/nam077.me\n`;
        await this.sendTextMessage(senderPsid, message);
        await this.sendTextMessage(senderPsid, contact);
    }

    private async sendMultiTextMessage(senderPsid: string, data: string[]) {
        for (const msg of data) {
            await this.sendTextMessage(senderPsid, msg);
        }
        return;
    }

    private async sendFood(senderPsid: string, userProfile: UserProfile) {
        const food: Food = await this.chatService.getRandomFood();
        await this.sendTextMessage(senderPsid, `Ch??o ${userProfile.name}, m??nh g???i ?? cho b???n m??n ??n ngon nh??`);
        await this.sendImageMessage(senderPsid, food.image);
        await this.sendTextMessage(senderPsid, food.name);
        await this.sendTextMessage(senderPsid, food.description);
        await this.sendTextMessage(senderPsid, food.recipe);
        return;
    }

    // Ran
    private async sendQuickReplyChatGPT(senderPsid: string, userProfile: UserProfile) {
        if (this.senderUsingChatGPT.includes(senderPsid)) {
            const message = `Ch??o ${userProfile.name}\nB???n ???? b???t CHAT GPT, b???n c?? mu???n t???t CHAT GPT kh??ng?`;
            const quickReplies = [
                {
                    content_type: 'text',
                    title: '???? T???t Chat GPT',
                    payload: 'OFF_CHAT_GPT',
                },
            ];
            await this.sendQuickReply(senderPsid, message, quickReplies);
        } else {
            const message = `Ch??o ${userProfile.name}\nB???n c?? mu???n b???t CHAT GPT kh??ng?`;
            const quickReplies = [
                {
                    content_type: 'text',
                    title: '???? B???t Chat GPT',
                    payload: 'ON_CHAT_GPT',
                },
            ];
            await this.sendQuickReply(senderPsid, message, quickReplies);
        }
    }
}

export interface UserProfile {
    first_name: string;
    last_name: string;
    profile_pic: string;
    name: string;
    id: string;
}

export interface ReceivedMessage {
    mid: string;
    text: string;
}

export interface ReceivedAttachment {
    type: string;
    attachments: Attachment[];
}

export interface Attachment {
    type: string;
    payload: {
        url: string;
    };
}

export interface ReceivedPostback {
    title: string;
    payload: string;
    mid: string;
}

export type ReceivedQuickReply = ReceivedPostback;
