import { PartialType } from '@nestjs/mapped-types';
import { ArticleDTO } from './article.dto';

export class UpdateArticleDto extends PartialType(ArticleDTO) {}
