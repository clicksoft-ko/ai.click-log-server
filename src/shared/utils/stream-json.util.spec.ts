import * as compression from 'compression';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express } from 'express';
import { AddressInfo } from 'net';
import { compressionConfig } from '../../config/compression.config';
import { paginateByIdDesc, streamJsonArray } from './stream-json.util';

async function collect<T>(iterator: AsyncIterable<T>) {
  const items: T[] = [];
  for await (const item of iterator) items.push(item);
  return items;
}

async function* toBatches<T>(batches: T[][], failAt?: number) {
  for (let i = 0; i < batches.length; i++) {
    if (i === failAt) throw new Error('batch failed');
    yield batches[i];
  }
  if (failAt === batches.length) throw new Error('batch failed');
}

describe('paginateByIdDesc', () => {
  const rows = [9, 8, 7, 6, 5].map((id) => ({ id }));
  const fetchPage = jest.fn(async (cursor: number | undefined, take: number) =>
    rows
      .filter((row) => cursor === undefined || row.id < cursor)
      .slice(0, take),
  );

  beforeEach(() => fetchPage.mockClear());

  it('마지막 id 를 커서로 이어 받고, 덜 찬 배치에서 멈춘다', async () => {
    const batches = await collect(paginateByIdDesc(fetchPage, 2));

    expect(batches.map((batch) => batch.map((row) => row.id))).toEqual([
      [9, 8],
      [7, 6],
      [5],
    ]);
    expect(fetchPage.mock.calls).toEqual([
      [undefined, 2],
      [8, 2],
      [6, 2],
    ]);
  });

  it('건수가 배치 크기의 배수이면 빈 배치는 내보내지 않는다', async () => {
    const batches = await collect(paginateByIdDesc(fetchPage, 5));

    expect(batches).toHaveLength(1);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('결과가 없으면 배치를 내보내지 않는다', async () => {
    const empty = jest.fn(async () => [] as { id: number }[]);

    expect(await collect(paginateByIdDesc(empty, 2))).toEqual([]);
  });
});

describe('streamJsonArray', () => {
  let server: ReturnType<Express['listen']>;
  let baseUrl: string;
  let source: () => AsyncIterator<{ id: number }[]>;
  const onError = jest.fn();

  beforeAll(async () => {
    // express 는 직접 의존성이 아니므로 Nest 의 ExpressAdapter 로 인스턴스를 얻는다
    const app = new ExpressAdapter().getInstance<Express>();
    // 운영과 같은 압축 미들웨어를 거치게 한다
    app.use(compression(compressionConfig));
    app.get('/', async (_req, res) => {
      try {
        await streamJsonArray(res, source(), onError);
      } catch {
        res.status(500).json({ message: 'first batch failed' });
      }
    });
    await new Promise<void>((resolve) => {
      server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
  });

  afterAll(() => new Promise((resolve) => server.close(resolve)));
  beforeEach(() => onError.mockClear());

  it('여러 배치를 하나의 JSON 배열로 보낸다', async () => {
    const rows = Array.from({ length: 3000 }, (_, i) => ({ id: 3000 - i }));
    source = () => toBatches([rows.slice(0, 2000), rows.slice(2000)]);

    const response = await fetch(baseUrl);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(rows);
  });

  it('배치가 없으면 빈 배열을 보낸다', async () => {
    source = () => toBatches([]);

    expect(await (await fetch(baseUrl)).json()).toEqual([]);
  });

  it('첫 배치 조회가 실패하면 응답 시작 전에 예외를 던진다', async () => {
    source = () => toBatches([[{ id: 1 }]], 0);

    const response = await fetch(baseUrl);

    expect(response.status).toBe(500);
    expect(onError).not.toHaveBeenCalled();
  });

  it('중간 배치 조회가 실패하면 응답을 끊어 정상 JSON 으로 받지 않게 한다', async () => {
    source = () => toBatches([[{ id: 2 }], [{ id: 1 }]], 1);

    // 압축 버퍼 때문에 헤더 전송 전에 끊길 수도, 본문 도중에 끊길 수도 있다. 어느 쪽이든 오류여야 한다
    const read = async () => (await fetch(baseUrl)).text();

    await expect(read()).rejects.toThrow();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'batch failed' }),
    );
  });
});
