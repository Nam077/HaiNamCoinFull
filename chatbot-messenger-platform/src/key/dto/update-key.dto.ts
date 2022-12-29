import { CreateKeyDto } from './create-key.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateKeyDto extends PartialType(CreateKeyDto) {}
