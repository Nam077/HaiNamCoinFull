import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('food')
@ApiTags('Food')
@ApiBearerAuth()
export class FoodController {
    constructor(private readonly foodService: FoodService) {}

    @Post()
    @ApiOperation({ summary: 'Create food' })
    create(@Body() createFoodDto: CreateFoodDto) {
        return this.foodService.create(createFoodDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all foods' })
    findAll() {
        return this.foodService.findAll();
    }
    @Get('create-many')
    @ApiOperation({ summary: 'Create many foods' })
    createMany() {
        return this.foodService.createMany();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get food by id' })
    findOne(@Param('id') id: string) {
        return this.foodService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update food by id' })
    update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
        return this.foodService.update(+id, updateFoodDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete food by id' })
    remove(@Param('id') id: string) {
        return this.foodService.remove(+id);
    }
}
