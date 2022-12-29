import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>) {}

    create(createImageDto: CreateImageDto) {
        return 'This action adds a new image';
    }

    findAll() {
        return `This action returns all image`;
    }

    findOne(id: number) {
        return `This action returns a #${id} image`;
    }

    update(id: number, updateImageDto: UpdateImageDto) {
        return `This action updates a #${id} image`;
    }

    async remove(id: number) {
        return `This action removes a #${id} image`;
    }

    async findAllByUrls(urls: string[]): Promise<Image[]> {
        return await this.imageRepository.find({
            where: [
                {
                    url: In(urls),
                },
            ],
        });
    }

    async bulkCreate(images: CreateImageDto[]) {
        const result: Image[] = [];
        const findImages = await this.findAllByUrls(images.map((image) => image.url));
        const createUrls = images.filter((image) => !findImages.find((findImage) => findImage.url === image.url));
        const chunkedArray = this.chunkArray(createUrls, 100);
        for (const chunk of chunkedArray) {
            const images = await this.imageRepository.save(chunk);
            result.push(...images);
        }
        return [...result, ...findImages];
    }

    chunkArray(images: CreateImageDto[], number: number): CreateImageDto[][] {
        const result = [];
        for (let i = 0; i < images.length; i += number) {
            result.push(images.slice(i, i + number));
        }
        return result;
    }
}
