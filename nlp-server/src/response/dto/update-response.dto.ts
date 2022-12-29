import { CreateResponseDto } from './create-response.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateResponseDto extends PartialType(CreateResponseDto) {}
