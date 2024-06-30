import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AtGuard)
  @Post('new')
  async newArticle(
    @Body() dto: ArticleDTO,
    @GetCurrentUser('userId', ParseUUIDPipe) id: UserEntity,
  ) {
    return this.articleService.createArticle(dto, id);
  }

  @UseGuards(AtGuard)
  @Get()
  findAll(@GetCurrentUser('userId', ParseUUIDPipe) id: UserEntity) {
    return this.articleService.findAll(id);
  }

  @UseGuards(AtGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) articleId: ArticleEntity,
    @GetCurrentUser('userId', ParseUUIDPipe) userId: UserEntity,
  ) {
    return this.articleService.findOne(articleId, userId);
  }
}
