import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signUp request', () => {
    const email: string = 'c@c.com';//<----On every new testing email has to be new .
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: 'asdf' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email)
      });
  });

  it('signup as new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';
    const res = await request(app.getHttpServer())//<--- This request object is the part of the library called 'Super Agent', it doesn't handle cookie option which we will get in response so we need to sore it separately and temporarely.
      .post('/auth/signup')
      .send({email, password: 'asdf'})
      .expect(201)
    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
    expect(body.email).toEqual(email); 
  });
});