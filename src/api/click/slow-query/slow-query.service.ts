import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { YmdDto } from '../dto/ymd.dto';
import { SaveSlowQueryDto } from './dto/save-slow-query.dto';
import { koDayjs } from '@/shared/utils/date.util';
import { paginateByIdDesc } from '@/shared/utils/stream-json.util';

// 행 하나의 본문(에러 메시지·쿼리 문자열 등)에 길이 제한이 없어 배치를 작게 잡는다
const BATCH_SIZE = 1000;

@Injectable()
export class SlowQueryService {
  constructor(private prisma: ClickPrismaService) {}

  async saveSlowQuery(dto: SaveSlowQueryDto) {
    const data = await this.prisma.$transaction(async (tx) => {
      const slowQuery = await tx.slowQuery.create({
        data: {
          computerName: dto.computerName,
          ykiho: dto.ykiho,
          assemblyName: dto.assemblyName,
          className: dto.className,
          methodName: dto.methodName,
          queryString: dto.queryString,
          executionSeconds: dto.executionSeconds,
          ver: dto.ver,
        },
      });

      if (dto.stackFrames && dto.stackFrames.length > 0) {
        await tx.slowQueryStackFrame.createMany({
          data: dto.stackFrames.map((stackFrame) => ({
            ...stackFrame,
            slowQueryId: slowQuery.id,
          })),
        });
      }

      return slowQuery;
    });

    return data;
  }

  /** 하루치 슬로우 쿼리를 배치 단위로 내보낸다 (결과 전체를 메모리에 모으지 않음) */
  getSlowQueryBatches(query: YmdDto) {
    const date = koDayjs(dayjs(query.ymd, 'YYYYMMDD'));

    return paginateByIdDesc(
      (cursor, take) =>
        this.prisma.slowQuery.findMany({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: date.add(1, 'day').startOf('day').toDate(),
            },
            id: cursor === undefined ? undefined : { lt: cursor },
          },
          orderBy: { id: 'desc' },
          take,
        }),
      BATCH_SIZE,
    );
  }

  getSlowQueryStackFrames(id: number) {
    return this.prisma.slowQueryStackFrame.findMany({
      where: {
        slowQueryId: id,
      },
    });
  }
}
