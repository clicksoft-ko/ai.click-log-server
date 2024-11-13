import { SigninDto } from '@/api/auth/dto/signin.dto';
import * as request from 'supertest';
import { signinTest } from 'test/e2e/common';
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
    const { status, accessToken: token } = await signinTest(app);

    expect(status).toBe(200);
    accessToken = token;
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
