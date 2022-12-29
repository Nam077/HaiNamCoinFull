import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../decorators/auth/auth.decorator';

@Controller('messenger')
@ApiBearerAuth()
@ApiTags('Messenger')
export class MessengerController {
    constructor(private readonly messengerService: MessengerService) {}

    @IsPublic()
    @Get('/webhook')
    @ApiOperation({ summary: 'Setup webhook' })
    getWebHook(
        @Query('hub.mode') mode: string,
        @Query('hub.challenge') challenge: string,
        @Query('hub.verify_token') verifyToken: string,
    ) {
        console.log(mode, challenge, verifyToken);
        return this.messengerService.getWebHook(mode, challenge, verifyToken);
    }

    @IsPublic()
    @Post('/webhook')
    @ApiOperation({ summary: 'Setup webhook' })
    postWebHook(@Body() body) {
        return this.messengerService.postWebHook(body);
    }

    @Get('setup')
    @ApiOperation({ summary: 'Setup' })
    async setupMenu() {
        return this.messengerService.setUp();
    }

    @IsPublic()
    @Get('test')
    @ApiOperation({ summary: 'Test' })
    async test(@Query('senderPsid') senderPsid: string) {
        return this.messengerService.test(senderPsid);
    }
}
