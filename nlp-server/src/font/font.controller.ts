import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FontService } from './font.service';
import { CreateFontDto } from './dto/create-font.dto';
import { UpdateFontDto } from './dto/update-font.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('font')
@ApiTags('Font')
@ApiBearerAuth()
export class FontController {
    constructor(private readonly fontService: FontService) {}

    @Post()
    @ApiOperation({ summary: 'Create font' })
    create(@Body() createFontDto: CreateFontDto) {
        return this.fontService.create(createFontDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all fonts' })
    findAll() {
        return this.fontService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get font by id' })
    findOne(@Param('id') id: string) {
        return this.fontService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update font by id' })
    update(@Param('id') id: string, @Body() updateFontDto: UpdateFontDto) {
        return this.fontService.update(+id, updateFontDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete font by id' })
    remove(@Param('id') id: string) {
        return this.fontService.remove(+id);
    }
}
