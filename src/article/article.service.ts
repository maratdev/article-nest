import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './model/article.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ArticleDTO } from './dto/article.dto';
import { UserEntity } from '../users/model/user.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Cache } from 'cache-manager';
import { ARTICLE } from './constants';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async createArticle(
    article: ArticleDTO,
    userId: UserEntity,
  ): Promise<ArticleEntity> {
    await this.articleCheckDuplicateTitle(article);

    const newArticle = {
      ...article,
      author: userId,
    };
    return await this.articleRepository.save(newArticle);
  }

  async findOne(
    articleId: ArticleEntity,
    userId: UserEntity,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne(<FindOneOptions>{
      relations: ['author'],
      where: {
        id: articleId,
        author: {
          id: userId,
        },
      },
      select: {
        author: {
          id: true,
          firstName: true,
          email: true,
        },
      },
    });
    if (!article) throw new NotFoundException(ARTICLE.NOT_FOUND);
    return article;
  }
  async updateArticle(
    articleId: ArticleEntity,
    dto: UpdateArticleDto,
    userId: UserEntity,
  ) {
    await this.articleCheckDuplicateTitle(dto);
    const article = await this.articleRepository.findOne(<FindOneOptions>{
      where: {
        id: articleId,
        author: {
          id: userId,
        },
      },
    });
    if (!article) throw new NotFoundException(ARTICLE.NOT_FOUND);
    return await this.articleRepository.update(articleId, dto);
  }

  async findAll(
    userId: UserEntity,
    page: number = 1,
    limit: number = 100,
    order: string = 'desc',
  ): Promise<unknown> {
    return await this.articleRepository.find(<FindManyOptions>{
      relations: ['author'],
      where: {
        author: {
          id: userId,
        },
      },
      order: {
        createdAt: order,
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        author: {
          id: true,
          firstName: true,
          email: true,
        },
      },
    });
  }

  async deleteArticle(articleId: ArticleEntity, userId: UserEntity) {
    const article = await this.articleRepository.findOne(<FindOneOptions>{
      where: {
        id: articleId,
        author: {
          id: userId,
        },
      },
    });
    if (!article) throw new NotFoundException(ARTICLE.NOT_FOUND);
    return await this.articleRepository.delete(articleId);
  }

  //--------------------- Вспомогательные методы --------------------/
  private async articleCheckDuplicateTitle(article) {
    if (!article.title || !article)
      throw new NotAcceptableException(ARTICLE.BAD_REQUEST);
    const isExist = await this.articleRepository.findBy({
      title: article.title,
    });
    if (isExist.length) throw new ConflictException(ARTICLE.CONFLICT);
  }
}
