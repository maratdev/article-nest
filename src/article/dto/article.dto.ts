import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ArticleDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
