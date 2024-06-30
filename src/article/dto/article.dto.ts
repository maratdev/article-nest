import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserEntity } from '../../users/model/user.entity';

export class ArticleDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString() //ISO8601
  publicationDate: Date;

  @IsString()
  author: UserEntity;
}
