import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dbConfiguration from '../bd/db.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      load: [dbConfiguration],
    }),
  ],
})
export class ConfigAppModule {}
