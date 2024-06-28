import { Module } from '@nestjs/common';
import { ConfigAppModule } from './config/core/config-app.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigAppModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
