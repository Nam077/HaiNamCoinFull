import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('message')
@ApiBearerAuth()
@ApiTags('Message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @ApiOperation({ summary: 'Create message' })
    create(@Body() createMessageDto: CreateMessageDto) {
        return this.messageService.create(createMessageDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all messages' })
    findAll() {
        return this.messageService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get message by id' })
    findOne(@Param('id') id: string) {
        return this.messageService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update message by id' })
    update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
        return this.messageService.update(+id, updateMessageDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete message by id' })
    remove(@Param('id') id: string) {
        return this.messageService.remove(+id);
    }
}
