import { SigninDto } from '@/api/auth/dto/signin.dto';
import * as request from 'supertest';
import { app, envService, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

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
        userId: envService.USER_ID,
        password: envService.PASSWORD
      } satisfies SigninDto)
      .expect(200);

    accessToken = response.body.accessToken;
    expect(accessToken).toBeDefined();
  });

  it('/auth/check (POST)', async () => {
    expect(accessToken).toBeDefined();
    expect(accessToken.length).toBeGreaterThan(0);

    const response = await request(app.getHttpServer())
      .post('/auth/check')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);

    console.log('Auth check response:', response.body);
    
    expect(response.body.isAuthenticated).toBeTruthy();
  });
});
