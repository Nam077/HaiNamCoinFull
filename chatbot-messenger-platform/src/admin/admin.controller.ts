import { Controller, Get, Post, Body, Patch, Query, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    @ApiOperation({ summary: 'Create admin' })
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all admins' })
    findAll() {
        return this.adminService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get admin by id' })
    findOne(@Param('id') id: string) {
        return this.adminService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update admin by id' })
    update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
        return this.adminService.update(+id, updateAdminDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete admin by id' })
    remove(@Param('id') id: string) {
        return this.adminService.remove(+id);
    }
}
