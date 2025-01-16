import { SaveSlowQueryDto } from '@/api/click/slow-query/dto/save-slow-query.dto';
import * as request from 'supertest';
import {
  app,
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'test/e2e/setup';

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('click/slow-query (Post)', async () => {
    const response = await request(app.getHttpServer())
      .post('/click/slow-query')
      .send({
        ykiho: '10170068',
        computerName: 'test컴퓨터',
        moduleName: 'test.exe',
        path: 'main.js',
        queryString: 'SELECT * FROM users',
        executionSeconds: 10.25,
      } satisfies SaveSlowQueryDto)
      .expect(201);

    expect(response.body.ykiho).toBe('10170068');
  });

  it('click/slow-query (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/click/slow-query')
      .query({ ymd: '20250116' })
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('ykiho');
    expect(response.body[0]).toHaveProperty('computerName');
    expect(response.body[0]).toHaveProperty('moduleName');
    expect(response.body[0]).toHaveProperty('path');
    expect(response.body[0]).toHaveProperty('queryString');
    expect(response.body[0]).toHaveProperty('executionSeconds');
  });
});
