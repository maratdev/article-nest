import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/model/user.entity';
import { Repository } from 'typeorm';
import { UserAuthDto } from './dto/user.dto';
import { AUTH } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registerUser(dto: UserAuthDto): Promise<UserEntity> {
    await this.checkDuplicateUser(dto.email);
    const userData = this.userRepository.create(dto);
    await this.userRepository.save(userData);
  }

  // register
  // login
  // refresh
  // logout
  //--------------------- Вспомогательные методы --------------------/
  private async checkDuplicateUser(email: string): Promise<boolean> {
    const role = await this.userRepository.findOneBy({ email });
    if (role) {
      throw new ConflictException(AUTH.DUPLICATE);
    }
    return !!role;
  }
}
