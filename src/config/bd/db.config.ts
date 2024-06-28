import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    logging: true,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    autoLoadEntities: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['migration/*{.ts,.js}'],
    cli: {
      migrationsDir: 'migration',
    },
  };
});
