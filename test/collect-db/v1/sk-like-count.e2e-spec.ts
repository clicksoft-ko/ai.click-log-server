import { CreateSkLikeCountDto } from '@/api/collect-db/v1/dto/sk-like-count.dto';
import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
import {
  app,
  setupCollectDbTestEnvironment,
  teardownTestEnvironment,
} from 'test/e2e/setup';
describe('collect-db sk-like-count (e2e)', () => {
  beforeAll(async () => {
    await setupCollectDbTestEnvironment();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  const getLikeCount = async (ycode: string, skcode: string) => {
    return request(app.getHttpServer())
      .get('/collect-db/v1/sk-like-count')
      .set(apiHeader.click.key, apiHeader.click.value)
      .query({ ycode, skcode })
      .expect(200);
  };

  it('/sk-like-count (Post)', async () => {
    let response = await getLikeCount('000000001', 'A001');
    let likesCount = response.body.likesCount ?? 0;
    await request(app.getHttpServer())
      .post('/collect-db/v1/sk-like-count')
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        datas: [
          {
            ycode: '000000001',
            skcode: 'A001',
            like: true
          },
          {
            ycode: '000000002',
            skcode: 'B001',
            like: false
          }
        ]
      } satisfies CreateSkLikeCountDto)
      .expect(204);

    response = await getLikeCount('000000001', 'A001');
    expect(response.body.likesCount).toBe(likesCount + 1);
  });

  it('/sk-like-count (Get)', async () => {
    const response = await getLikeCount('000000001', 'A001');

    expect(response.body.likesCount).toBeGreaterThan(0);
  });

});
