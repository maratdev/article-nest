import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './model/article.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ArticleDTO } from './dto/article.dto';
import { UserEntity } from '../users/model/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(article: ArticleDTO, userId: UserEntity) {
    const isExist = await this.articleRepository.findBy({
      title: article.title,
    });
    if (isExist.length) throw new ConflictException('Article already exists');

    const newArticle = {
      ...article,
      author: userId,
    };
    return await this.articleRepository.save(newArticle);
  }

  async findAll(userId: UserEntity): Promise<ArticleEntity[]> {
    return await this.articleRepository.find(<FindManyOptions>{
      relations: ['author'],
      where: {
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
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }
}
