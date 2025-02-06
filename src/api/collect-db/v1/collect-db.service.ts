import { HttpException, Injectable } from '@nestjs/common';
import { CreateChDto } from './dto/create-ch.dto';
import { CollectDbPrismaService } from '@/database/prisma/collect-db-prisma.service';

@Injectable()
export class CollectDbService {
  constructor(private readonly prisma: CollectDbPrismaService) {}

  async createCh(dto: CreateChDto) {
    await this.prisma.$transaction(async (tx: CollectDbPrismaService) => {
      await this.deleteExistingChKey(tx, dto);
      const createdChKey = await this.createChKey(tx, dto);
      await this.createRelatedData(tx, createdChKey.id, dto);
    });
  }

  private async deleteExistingChKey(
    tx: CollectDbPrismaService,
    dto: CreateChDto,
  ) {
    const existingChKey = await tx.chKey.findUnique({
      where: {
        ykiho_chart_symd_gubun_chasu_week_saup_weibgu_yuhyung_ackgubun_dup_eymd_ibymd_fibymd:
          {
            ykiho: dto.ykiho,
            chart: dto.chart,
            symd: dto.symd,
            gubun: dto.gubun,
            chasu: dto.chasu,
            week: dto.week,
            saup: dto.saup,
            weibgu: dto.weibgu,
            yuhyung: dto.yuhyung,
            ackgubun: dto.ackgubun,
            dup: dto.dup,
            eymd: dto.eymd,
            ibymd: dto.ibymd,
            fibymd: dto.fibymd,
          },
      },
    });
    if (existingChKey) {
      await tx.chKey.delete({ where: { id: existingChKey.id } });
    }
  }

  private async createChKey(tx: CollectDbPrismaService, dto: CreateChDto) {
    return await tx.chKey.create({
      data: {
        ykiho: dto.ykiho,
        ackgubun: dto.ackgubun,
        chart: dto.chart,
        chasu: dto.chasu,
        dup: dto.dup,
        eymd: dto.eymd,
        fibymd: dto.fibymd,
        gubun: dto.gubun,
        ibymd: dto.ibymd,
        saup: dto.saup,
        symd: dto.symd,
        week: dto.week,
        weibgu: dto.weibgu,
        yuhyung: dto.yuhyung,
      },
    });
  }

  private async createRelatedData(
    tx: CollectDbPrismaService,
    keyId: number,
    dto: CreateChDto,
  ) {
    await tx.chInfo.create({ data: { keyId, ...dto.info } });
    await tx.chSk.createMany({ data: dto.sk.map((sk) => ({ keyId, ...sk })) });
    await tx.chJy.createMany({ data: dto.jy.map((jy) => ({ keyId, ...jy })) });
    if (dto.jc) {
      await tx.chJc.createMany({
        data: dto.jc.map((jc) => ({ keyId, ...jc })),
      });
    }
  }
}
