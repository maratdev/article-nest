import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/model/user.entity';
import { Repository } from 'typeorm';
import { UserAuthDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { AUTH } from './constants';
import { compare, genSalt, hash } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { validate as uuidValidate } from 'uuid';
import { Tokens } from './types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    dto: UserAuthDto,
  ): Promise<Omit<UserEntity, 'password' | 'hashedRt'>> {
    const salt = await genSalt(10);
    await this.checkDuplicateUser(dto.email);
    const newUser = this.userRepository.create({
      ...dto,
      password: await hash(dto.password, salt),
    });
    const addedUser = await this.userRepository.save(newUser);
    const tokens = await this.getToken(newUser.id, dto.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return this.returnUserFields(addedUser);
  }

  async login({ email, password }: LoginDto): Promise<Tokens> {
    const user = await this.validateUser(email, password);
    const tokens = await this.getToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
    };
  }

  async refreshTokens(id: string, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user?.hashedRt) throw new UnauthorizedException(AUTH.SIGN_IN);

    const rtMatch = await compare(rt, user.hashedRt);
    if (!rtMatch) throw new UnauthorizedException(AUTH.LOGIN_EXIST);

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  async logout(id: string) {
    return this.userRepository.save({
      id,
      hashedRt: null,
    });
  }

  // logout
  //--------------------- Вспомогательные методы --------------------/
  private async returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      isActive: user.isActive,
    };
  }

  private async hashData(data: string) {
    return hash(data, 10);
  }

  private async updateRtHash(id: string, rt: string): Promise<void> {
    this.uuidValidate(id);
    const hashedRt = await this.hashData(rt);
    await this.userRepository.update(id, { hashedRt });
  }

  private uuidValidate(uuid) {
    if (!uuidValidate(uuid)) throw new BadRequestException('Invalid user uuid');
    return uuid;
  }

  private async checkDuplicateUser(email: string): Promise<boolean> {
    const role = await this.userRepository.findOneBy({ email });
    if (role) {
      throw new ConflictException(AUTH.DUPLICATE);
    }
    return !!role;
  }

  private async getToken(userId: string, email: string): Promise<Tokens> {
    this.uuidValidate(userId);
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.configService.get<string>('ACCESS_JWT'),
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          expiresIn: this.configService.get<string>('REFRESH_JWT'),
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  private async getDataUser({
    email,
  }: Pick<UserEntity, 'email'>): Promise<UserEntity> {
    const check = await this.userRepository.findOneBy({ email });
    if (!check) throw new NotFoundException(AUTH.NOT_FOUND);
    return check;
  }

  private async validateUser(email: string, password: string) {
    const user = await this.getDataUser({ email });
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(AUTH.LOGIN_EXIST);
    return {
      id: user.id,
      email: user.email,
    };
  }
}
