import { Module } from '@nestjs/common';
import { FontService } from './font.service';
import { FontController } from './font.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Font } from './entities/font.entity';
import { KeyModule } from '../key/key.module';
import { MessageModule } from '../message/message.module';
import { LinkModule } from '../link/link.module';
import { TagModule } from '../tag/tag.module';
import { ImageModule } from '../image/image.module';

@Module({
    imports: [TypeOrmModule.forFeature([Font]), KeyModule, MessageModule, LinkModule, TagModule, ImageModule],
    controllers: [FontController],
    providers: [FontService],
    exports: [FontService],
})
export class FontModule {}
