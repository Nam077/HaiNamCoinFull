import { PartialType } from '@nestjs/swagger';
import { CreateBanDto } from './create-ban.dto';

export class UpdateBanDto extends PartialType(CreateBanDto) {}
