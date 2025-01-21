import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { YmdDto } from '../dto/ymd.dto';
import { SaveSlowQueryDto } from './dto/save-slow-query.dto';
import { koDayjs } from '@/shared/utils/date.util';

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

      if (dto.stackframes && dto.stackframes.length > 0) {
        await tx.slowQueryStackFrame.createMany({
          data: dto.stackframes.map((stackFrame) => ({
            ...stackFrame,
            slowQueryId: slowQuery.id,
          })),
        });
      }

      return slowQuery;
    });

    return data;
  }

  async getSlowQuery(query: YmdDto) {
    const date = koDayjs(dayjs(query.ymd, 'YYYYMMDD'));

    const data = await this.prisma.slowQuery.findMany({
      where: {
        createdAt: {
          gte: date.startOf('day').toDate(),
          lte: date.endOf('day').toDate(),
        },
      },
    });
    return data;
  }
}
