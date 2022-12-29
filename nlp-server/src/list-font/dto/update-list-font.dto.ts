import { PartialType } from '@nestjs/swagger';
import { CreateListFontDto } from './create-list-font.dto';

export class UpdateListFontDto extends PartialType(CreateListFontDto) {}
