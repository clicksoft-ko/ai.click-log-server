import { CreateChDto } from '@/api/collect-db/v1/dto/create-ch.dto';
import { apiHeader } from '@/constants/api-header';
import * as request from 'supertest';
import {
  app,
  setupCollectDbTestEnvironment,
  teardownTestEnvironment,
} from 'test/e2e/setup';

describe('collect-db ch(e2e)', () => {
  beforeAll(async () => {
    await setupCollectDbTestEnvironment();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('/ch (Post)', async () => {
    await request(app.getHttpServer())
      .post('/collect-db/v1/ch')
      .set(apiHeader.click.key, apiHeader.click.value)
      .send({
        hanbang: false,
        ykiho: '10170068',
        ackgubun: 'A',
        chart: '00000001',
        chasu: 'A',
        dup: 1,
        eymd: '20230101',
        fibymd: '20230101',
        gubun: 'M',
        ibymd: '20230101',
        saup: '01',
        symd: '20230101',
        week: '1',
        weibgu: '2',
        yuhyung: '01',
        info: {
          age: 30,
          birthday: '19900101',
          sex: 'M',
        },
        jy: [
          {
            wonnae: true,
            key: '1|1',
            ilto: 1,
            haesu: 2,
            chongto: 1,
            htoyak: 0.5,
            yakgu: '3',
            myung: '테스트 리보트릴 정',
            ycode: '123456789',
          },
        ],
        sk: [
          {
            code: 'test',
            myung: '테스트 상병',
            result: 'Y',
            specialCode: 'test',
            ymd: '20230101',
          },
        ],
        jc: [
          {
            spCode: 'MX999',
            spGubun: 'B',
            jyKey: '1|1',
            chamgo: '참고사항입니다.',
          },
        ],
      } satisfies CreateChDto)
      .expect(204);
  });
});
