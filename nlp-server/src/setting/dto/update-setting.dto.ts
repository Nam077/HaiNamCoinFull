import { CreateSettingDto } from './create-setting.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
