import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListFontService } from './list-font.service';
import { CreateListFontDto } from './dto/create-list-font.dto';
import { UpdateListFontDto } from './dto/update-list-font.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('list-font')
@ApiBearerAuth()
@ApiTags('List Font')
export class ListFontController {
    constructor(private readonly listFontService: ListFontService) {}

    @Post()
    @ApiOperation({ summary: 'Create a list font' })
    create(@Body() createListFontDto: CreateListFontDto) {
        return this.listFontService.create(createListFontDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all list fonts' })
    findAll() {
        return this.listFontService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a list font' })
    findOne(@Param('id') id: string) {
        return this.listFontService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a list font' })
    update(@Param('id') id: string, @Body() updateListFontDto: UpdateListFontDto) {
        return this.listFontService.update(+id, updateListFontDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a list font' })
    remove(@Param('id') id: string) {
        return this.listFontService.remove(+id);
    }
}
