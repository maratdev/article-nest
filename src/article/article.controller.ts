import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDTO } from './dto/article.dto';
import { GetCurrentUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/model/user.entity';
import { AtGuard } from '../config/guards/at.guard';
import { ArticleEntity } from './model/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OrderDto } from './dto/order.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@UseGuards(AtGuard)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('new')
  async newArticle(
    @Body() dto: ArticleDTO,
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
  ) {
    return this.articleService.createArticle(dto, userId);
  }

  @Get() // /article?order=asc&page=1&limit=3
  findAll(
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
    @Query() { order, page, limit }: OrderDto,
  ) {
    return this.articleService.findAll(userId, page, limit, order);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) articleId: ArticleEntity,
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
  ) {
    return this.articleService.findOne(articleId, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) articleId: ArticleEntity,
    @Body() dto: UpdateArticleDto,
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
  ) {
    return this.articleService.updateArticle(articleId, dto, userId);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) articleId: ArticleEntity,
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
  ) {
    return this.articleService.deleteArticle(articleId, userId);
  }
}
