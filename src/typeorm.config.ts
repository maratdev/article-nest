import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'nestarticle',
  entities: ['*/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['./migration'],
});
AppDataSource.initialize()
  .then(() => {
    Logger.log('Data Source has been initialized!');
  })
  .catch((err) => {
    Logger.error('Error during Data Source initialization', err);
  });
export default AppDataSource;
