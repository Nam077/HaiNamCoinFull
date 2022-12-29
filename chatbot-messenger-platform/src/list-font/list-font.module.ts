import { Module } from '@nestjs/common';
import { ListFontService } from './list-font.service';
import { ListFontController } from './list-font.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListFont } from './entities/list-font.entity';
import { FontModule } from '../font/font.module';

@Module({
    imports: [TypeOrmModule.forFeature([ListFont]), FontModule],
    controllers: [ListFontController],
    providers: [ListFontService],
    exports: [ListFontService],
})
export class ListFontModule {}
