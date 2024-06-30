import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';

  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Type(() => Number)
  limit: number;
}
