import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './entities/food.entity';
import { Repository } from 'typeorm';
import * as foods from './data/foods.json';
@Injectable()
export class FoodService {
    constructor(@InjectRepository(Food) private foodRepository: Repository<Food>) {}

    async create(createFoodDto: CreateFoodDto): Promise<Food> {
        return await this.foodRepository.save(createFoodDto);
    }

    async findAll(): Promise<Food[]> {
        return await this.foodRepository.find();
    }

    async findOne(id: number): Promise<Food> {
        return await this.foodRepository.findOne({ where: { id: id } });
    }

    async update(id: number, updateFoodDto: UpdateFoodDto) {
        return await this.foodRepository.update(id, updateFoodDto);
    }

    async remove(id: number): Promise<Food> {
        const food = await this.findOne(id);
        if (food) {
            return await this.foodRepository.remove(food);
        }
        return null;
    }

    async getCount(): Promise<number> {
        return await this.foodRepository.count();
    }

    async getRandomFood(): Promise<Food> {
        const count = await this.getCount();
        const random = Math.floor(Math.random() * count);
        const food = await this.findOne(random);
        if (!food) {
            return await this.getRandomFood();
        }
        return food;
    }

    async createMany(): Promise<string> {
        const foodsChunk = this.chunkArray(foods, 100);
        for (let i = 0; i < foodsChunk.length; i++) {
            await this.foodRepository.save(foodsChunk[i]);
        }
        return 'done';
    }

    chunkArray(myArray, chunk_size) {
        const results = [];
        for (let i = 0; i < myArray.length; i += chunk_size) {
            results.push(myArray.slice(i, i + chunk_size));
        }
        return results;
    }
}
