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

  it('/setting-record (GET) - baseList code 검색', async () => {
    await request(app.getHttpServer())
      .post(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        baseList: [
          { code: '1', gubun: '11', myung: '낙상' },
          { code: '2', gubun: '11', myung: '욕창' },
        ],
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .query({ code: '1' })
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(response.body.baseList).toEqual([
      { code: '1', gubun: '11', myung: '낙상' },
    ]);
    expect(response.body.medihome.use).toBe('test');

    const allResponse = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(allResponse.body.baseList).toHaveLength(2);
  });

  it('/setting-record (GET) - baseList code 검색 대소문자 무시', async () => {
    await request(app.getHttpServer())
      .post(`/click/setting-record/${ykiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        baseList: [
          { code: 'Ab', gubun: '11', myung: '낙상' },
          { code: 'cd', gubun: '11', myung: '욕창' },
          { gubun: '11', myung: '코드없음' },
        ],
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .query({ code: 'aB' })
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(response.body.baseList).toEqual([
      { code: 'Ab', gubun: '11', myung: '낙상' },
    ]);

    // code 가 없는 항목은 어떤 검색어와도 일치하지 않는다
    const missingCodeResponse = await request(app.getHttpServer())
      .get(`/click/setting-record/${ykiho}`)
      .query({ code: 'undefined' })
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(missingCodeResponse.body.baseList).toEqual([]);
  });

  it('/setting-record (GET all) - baseList code 검색', async () => {
    const otherYkiho = '10170069';
    await request(app.getHttpServer())
      .post(`/click/setting-record/${otherYkiho}`)
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({ baseList: [{ code: 'zz', gubun: '11', myung: '기타' }] })
      .expect(201);

    // 일치하는 항목이 있는 기관만, 일치하는 항목만 반환
    const response = await request(app.getHttpServer())
      .get('/click/setting-record')
      .query({ code: 'AB' })
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].ykiho).toBe(ykiho);
    expect(response.body[0].data.baseList).toEqual([
      { code: 'Ab', gubun: '11', myung: '낙상' },
    ]);
    expect(response.body[0].data.medihome.use).toBe('test');

    const allResponse = await request(app.getHttpServer())
      .get('/click/setting-record')
      .set(apiHeader.click.key, apiHeader.click.value)
      .expect(200);

    expect(allResponse.body).toHaveLength(2);
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
