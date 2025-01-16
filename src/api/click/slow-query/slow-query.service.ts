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
    const data = await this.prisma.slowQuery.create({
      data: {
        computerName: dto.computerName,
        ykiho: dto.ykiho,
        moduleName: dto.moduleName,
        path: dto.path,
        queryString: dto.queryString,
        executionSeconds: dto.executionSeconds,
      },
    });

    return data;
  }

  async getSlowQuery(query: YmdDto) {
    const date = dayjs(query.ymd, 'YYYYMMDD');

    const data = await this.prisma.slowQuery.findMany({
      where: {
        createdAt: {
          gte: dayjs(date).startOf('day').toDate(),
          lte: dayjs(date).endOf('day').toDate(),
        },
      },
    });
    return data;
  }
}
