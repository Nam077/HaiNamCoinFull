import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFoodDto {
    // name, description, image, recipe
    @ApiProperty({ description: 'Food name', example: 'food' })
    @IsString({ message: 'Food name must be a string' })
    @IsNotEmpty({ message: 'Food name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Food description', example: 'description' })
    @IsString({ message: 'Food description must be a string' })
    @IsNotEmpty({ message: 'Food description must not be empty' })
    description: string;

    @ApiProperty({ description: 'Food image', example: 'image' })
    @IsString({ message: 'Food image must be a string' })
    @IsNotEmpty({ message: 'Food image must not be empty' })
    image: string;

    @ApiProperty({ description: 'Food recipe', example: 'recipe' })
    @IsString({ message: 'Food recipe must be a string' })
    @IsNotEmpty({ message: 'Food recipe must not be empty' })
    recipe: string;
}
