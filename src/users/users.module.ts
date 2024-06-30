import { Module } from '@nestjs/common';
import { UserEntity } from './model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
