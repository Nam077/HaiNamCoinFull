import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { CrawlerService } from './crawler/crawler.service';
import { ChemistryService } from './chemistry/chemistry.service';
import { HttpModule } from '@nestjs/axios';
import { ExcelService } from './excel/excel.service';
import { KeyModule } from '../key/key.module';
import { FontModule } from '../font/font.module';
import { ImageModule } from '../image/image.module';
import { ResponseModule } from 'src/response/response.module';
import { SettingModule } from '../setting/setting.module';
import { ListFontModule } from '../list-font/list-font.module';
import { BanModule } from '../ban/ban.module';
import { AdminModule } from '../admin/admin.module';
import { FoodModule } from '../food/food.module';

@Module({
    imports: [
        HttpModule,
        KeyModule,
        FontModule,
        ImageModule,
        ImageModule,
        ResponseModule,
        SettingModule,
        ListFontModule,
        BanModule,
        AdminModule,
        FoodModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, CrawlerService, ChemistryService, ExcelService],
    exports: [ChatService],
})
export class ChatModule {}
