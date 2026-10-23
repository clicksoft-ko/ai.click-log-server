import { SaveErrorLogDto } from '@/api/click/error-log/dto/save-error-log.dto';
import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
import { signinTest } from 'test/e2e/common';
import { app, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await setupTestEnvironment()
  });

  afterAll(async () => {
    await teardownTestEnvironment()
  });

  it('/error-log (Post)', async () => {
    const response = await request(app.getHttpServer())
      .post("/click/error-log")
      .send({
        "ykiho": "10001000",
        "computerName": "test컴퓨터",
        "moduleName": "test.exe",
        "logLevel": "ERROR",
        "exceptionType": "textException",
        "errorMessage": "An unexpected error occurred.",
        "stackTrace": "Error: Something went wrong at main.js:25:13",
        "source": "main.js",
        "additionalData": {
          "userId": "987",
        },
        "clientVersion": "V00010001"
      } satisfies SaveErrorLogDto).expect(201);

    expect(response.body.ykiho).toBe("10001000");
  });

  it('/error-log (Get) - 목록은 화면이 쓰는 칸만 보낸다', async () => {
    const { accessToken } = await signinTest(app);
    const startDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const endDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const response = await request(app.getHttpServer())
      .get('/click/error-log')
      .query({ startDate, endDate })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const log = response.body.find(
      (row: { ykiho: string }) => row.ykiho === '10001000',
    );
    expect(log).toBeDefined();
    expect(log.errorMessage).toBe('An unexpected error occurred.');
    expect(log).not.toHaveProperty('additionalData');
    expect(log).not.toHaveProperty('source');
  });

  it('/error-log/:id/stacktrace/ (Get)', async () => {
    const { accessToken } = await signinTest(app);
    const response = await request(app.getHttpServer())
      .get("/click/error-log/1/stacktrace")
      .set(apiHeader.click.key, apiHeader.click.value)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.stackTrace).toBeDefined();
  });
});
