import { Response } from 'express';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

/**
 * id 내림차순 keyset 페이지네이션으로 배치를 차례로 내보낸다.
 * 결과 전체를 메모리에 모으지 않고 배치 단위로 처리할 때 쓴다.
 */
export async function* paginateByIdDesc<T extends { id: number }>(
  fetchPage: (cursor: number | undefined, take: number) => Promise<T[]>,
  take: number,
): AsyncGenerator<T[]> {
  let cursor: number | undefined;

  while (true) {
    const batch = await fetchPage(cursor, take);
    if (batch.length > 0) yield batch;
    if (batch.length < take) return;
    cursor = batch[batch.length - 1].id;
  }
}

/**
 * 배치 이터레이터를 JSON 배열로 스트리밍한다.
 * - 첫 배치는 응답 시작 전에 조회한다. 이 조회가 실패하면 예외가 호출자에게 전달되어 예외 필터가 오류 응답을 보낸다.
 * - 이후 배치에서 실패하면 응답을 끊어 클라이언트가 불완전한 JSON 을 정상 응답으로 받지 않게 한다.
 *   헤더 전송 뒤라 예외 필터가 응답할 수 없으므로 onError 로만 알린다.
 * - 전송이 끝날 때까지 기다리므로 인터셉터가 재는 응답 시간에 전송 시간까지 포함된다.
 */
export async function streamJsonArray<T>(
  res: Response,
  batches: AsyncIterator<T[]>,
  onError?: (error: Error) => void,
): Promise<void> {
  const first = await batches.next();

  async function* generateJson() {
    yield '[';
    let isFirstRow = true;
    for (let result = first; !result.done; result = await batches.next()) {
      for (const row of result.value) {
        yield (isFirstRow ? '' : ',') + JSON.stringify(row);
        isFirstRow = false;
      }
    }
    yield ']';
  }

  res.set({
    'Content-Type': 'application/json',
    'Transfer-Encoding': 'chunked',
  });

  try {
    await pipeline(Readable.from(generateJson(), { encoding: 'utf8' }), res);
  } catch (error) {
    onError?.(error as Error);
  }
}
