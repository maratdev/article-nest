import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Tokens } from '../src/auth/types';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: LoginDto = {
      email: 'admin@ya.ru',
      password: '123456',
    };

    let tokens: Tokens;

    it('should signin', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect(200)
        .expect(({ body }: { body: Tokens }) => {
          expect(body.access_token).toBeTruthy();
          tokens = body;
        });
    });
  });
});
