import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('Chat')
@ApiBearerAuth()
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    @ApiOperation({ summary: 'Get all chats' })
    async findAll() {
        return this.chatService.updateDataBySheet();
    }
}
