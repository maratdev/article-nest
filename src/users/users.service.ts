import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
}
