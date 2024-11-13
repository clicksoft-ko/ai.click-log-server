import { SigninDto } from '@/api/auth/dto/signin.dto';
import * as request from 'supertest';
import { app, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

describe('Auth (e2e)', () => {
  let accessToken: string;
  beforeAll(async () => {
    await setupTestEnvironment()
  });

  afterAll(async () => {
    await teardownTestEnvironment()
  });

  it('/auth/signin (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        userId: 'testuser',
        password: 'testpass'
      } satisfies SigninDto)
      .expect(200);

    accessToken = response.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  it('/auth/check (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.isAuthenticated).toBeDefined();
  });
});
