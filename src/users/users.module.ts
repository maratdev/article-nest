import { Module } from '@nestjs/common';
import { UserEntity } from './model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../article/model/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
})
export class UsersModule {}
