import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
import {
  app,
  clickPrisma,
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'test/e2e/setup';

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

  it('/setting-record (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        medihome: {
          use: 'prod',
          companyName: '테스트 병원',
        },
      })
      .expect(201);

    expect(response.body.ykiho).toBe(ykiho);
  });

  it('/setting-record (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(response.body.medihome.use).toBe('prod');
    expect(response.body.medihome.companyName).toBe('테스트 병원');
  });

  it('/setting-record (POST) - update existing record', async () => {
    // Then update
    const response = await request(app.getHttpServer())
      .post(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        medihome: {
          use: 'test',
          companyName: '테스트 병원 - 수정됨',
        },
      })
      .expect(201);

    expect(response.body.ykiho).toBe(ykiho);

    // Verify the update
    const getResponse = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(getResponse.body.medihome.use).toBe('test');
    expect(getResponse.body.medihome.companyName).toBe('테스트 병원 - 수정됨');
  });

  it('/setting-record (POST) - invalid ykiho', async () => {
    await request(app.getHttpServer())
      .post('/click/setting-record/1234567') // 8자리가 아닌 ykiho
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        medihome: {
          use: 'prod',
        },
      })
      .expect(400);
  });

  it('/setting-record (GET) - invalid ykiho', async () => {
    await request(app.getHttpServer())
      .get('/click/setting-record/abcd1234') // 숫자가 아닌 문자 포함
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(400);
  });
});
