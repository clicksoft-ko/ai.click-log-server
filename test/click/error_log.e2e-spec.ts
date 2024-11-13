import { SaveErrorLogDto } from '@/api/click/error-log/dto/save-error-log.dto';
import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
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

  it('/error-log/:id/stacktrace/ (Get)', async () => {
    const response = await request(app.getHttpServer())
      .get("/click/error-log/1/stacktrace")
      .set(apiHeader.click.key, apiHeader.click.value)  
      .expect(200);

    expect(response.body.stackTrace).toBeDefined();
  });
});
