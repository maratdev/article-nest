import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must have least 2 characters.' })
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20)
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
