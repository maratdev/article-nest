import { OmitType } from '@nestjs/swagger';
import { UserAuthDto } from './user.dto';

export class LoginDto extends OmitType(UserAuthDto, [
  'firstName',
  'isActive',
] as const) {}
