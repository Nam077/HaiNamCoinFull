import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ban } from './entities/ban.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Ban])],
    controllers: [BanController],
    providers: [BanService],
    exports: [BanService],
})
export class BanModule {}
