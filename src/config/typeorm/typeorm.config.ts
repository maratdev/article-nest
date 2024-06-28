import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('PG_HOST'),
      port: this.configService.get<number>('PG_PORT'),
      username: this.configService.get<string>('PG_USER'),
      password: this.configService.get<string>('PG_PASSWORD'),
      database: this.configService.get<string>('PG_DATABASE'),
      autoLoadEntities: true,
      synchronize: this.configService.get<string>('NODE_ENV') === 'production',
    };
  }
}
