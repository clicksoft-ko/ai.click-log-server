import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
import { app, clickPrisma, setupTestEnvironment, teardownTestEnvironment } from 'test/e2e/setup';

describe('Setting Record (e2e)', () => {
  const ykiho = '10170068';
  beforeAll(async () => {
    await setupTestEnvironment();
    await clickPrisma.settingRecord.deleteMany();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
    await clickPrisma.settingRecord.deleteMany();
  });

  it('/setting-record (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        useSilsonbohum: true
      })
      .expect(200);

    expect(response.body.ykiho).toBe(ykiho);
  });

  it('/setting-record (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .expect(200);

    expect(response.body.silsonbohum.use).toBe(true);
  });

  it('/setting-record (PUT) - update existing record', async () => {
    // Then update
    const response = await request(app.getHttpServer())
      .put(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        useSilsonbohum: false
      })
      .expect(200);

    expect(response.body.ykiho).toBe("10170068");
  });

  it('/setting-record (PUT) - invalid ykiho', async () => {
    await request(app.getHttpServer())
      .put('/click/setting-record/1234567') // 8자리가 아닌 ykiho
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        useSilsonbohum: true
      })
      .expect(400);
  });

  it('/setting-record (GET) - invalid ykiho', async () => {
    await request(app.getHttpServer())
      .get('/click/setting-record/abcd1234') // 숫자가 아닌 문자 포함
      .expect(400);
  });
});
