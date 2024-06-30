import { Module } from '@nestjs/common';
import { ConfigAppModule } from './config/core/config-app.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 30 * 1000,
    }),
    ConfigAppModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    AuthModule,
    ArticleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
