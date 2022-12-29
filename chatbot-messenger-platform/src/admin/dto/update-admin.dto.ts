import { CreateAdminDto } from './create-admin.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
