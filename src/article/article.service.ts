import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './model/article.entity';
import { Equal, Repository } from 'typeorm';
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
    if (isExist.length) throw new BadRequestException('Article already exists');

    const newArticle = {
      ...article,
      authorId: userId,
    };
    return await this.articleRepository.save(newArticle);
  }

  async findAll(userId: UserEntity) {
    return await this.articleRepository.find({
      relations: ['author'],
      where: {
        author: Equal(userId),
      },
    });
  }
}
