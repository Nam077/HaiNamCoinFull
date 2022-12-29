import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FontModule } from './font/font.module';
import { BanModule } from './ban/ban.module';
import { FoodModule } from './food/food.module';
import { ChatModule } from './chat/chat.module';
import { MessengerModule } from './messenger/messenger.module';
import { TagModule } from './tag/tag.module';
import { MessageModule } from './message/message.module';
import { LinkModule } from './link/link.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { KeyModule } from './key/key.module';
import { Key } from './key/entities/key.entity';
import { Font } from './font/entities/font.entity';
import { Message } from './message/entities/message.entity';
import { Food } from './food/entities/food.entity';
import { Ban } from './ban/entities/ban.entity';
import { Image } from './image/entities/image.entity';
import { AdminModule } from './admin/admin.module';
import { SettingModule } from './setting/setting.module';
import { Admin } from './admin/entities/admin.entity';
import { Setting } from './setting/entities/setting.entity';
import { Tag } from './tag/entities/tag.entity';
import { ResponseModule } from './response/response.module';
import { Response } from './response/entities/response.entity';
import { Link } from './link/entities/link.entity';
import { ListFontModule } from './list-font/list-font.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard/at-guard.guard';

@Module({
    imports: [
        UserModule,
        FontModule,
        BanModule,
        FoodModule,
        ChatModule,
        MessengerModule,
        TagModule,
        MessageModule,
        LinkModule,
        ImageModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'namnam',
            database: 'nvn-chat-bot',
            entities: [User, Key, Font, Message, Image, Link, Ban, Admin, Setting, Tag, Response, Setting, Food],
            logging: false,
            synchronize: true,
            autoLoadEntities: true,
        }),
        KeyModule,
        AdminModule,
        SettingModule,
        ResponseModule,
        ListFontModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AtGuard,
        },
    ],
})
export class AppModule {}
