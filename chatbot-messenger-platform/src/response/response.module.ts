import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Response } from './entities/response.entity';
import { ImageModule } from '../image/image.module';
import { KeyModule } from '../key/key.module';
import { MessageModule } from '../message/message.module';

@Module({
    imports: [TypeOrmModule.forFeature([Response]), ImageModule, KeyModule, MessageModule],
    controllers: [ResponseController],
    providers: [ResponseService],
    exports: [ResponseService],
})
export class ResponseModule {}
