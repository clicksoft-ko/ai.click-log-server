import { ClickSoftPrismaService } from '@/database/prisma/click-soft-prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateLinuxBackDto } from './dto/create-linux-back.dto';
import { UpdateLinuxBackDto } from './dto/update-linux-back.dto';
import { CreateLinuxBackDbDto } from './dto/create-linux-back-db.dto';
import { CreateLinuxBackTblDto } from './dto/create-linux-back-tbl.dto';

@Injectable()
export class LinuxBackService {
  constructor(private prisma: ClickSoftPrismaService) {}

  async createLinuxBack(dto: CreateLinuxBackDto) {
    return this.prisma.linuxBack.create({
      data: {
        ...(dto.id && { id: dto.id }),
        ykiho: dto.ykiho,
        key: dto.key,
        backupPath: dto.backupPath,
        startedAt: new Date(dto.startedAt),
      },
    });
  }

  async updateLinuxBack(id: string, dto: UpdateLinuxBackDto) {
    return this.prisma.linuxBack.update({
      where: { id },
      data: { endedAt: new Date(dto.endedAt) },
    });
  }

  async getLatestLinuxBacks() {
    const latestBacks = await this.prisma.linuxBack.findMany({
      distinct: ['ykiho', 'key'],
      orderBy: { startedAt: 'desc' },
      include: {
        dbs: {
          include: {
            tbls: true,
          },
        },
      },
    });

    return latestBacks.map((back) => ({
      ...back,
      dbs: back.dbs.map((db) => ({
        ...db,
        tbls: db.tbls.map((tbl) => ({
          ...tbl,
          id: Number(tbl.id),
        })),
      })),
    }));
  }

  async createLinuxBackDb(dto: CreateLinuxBackDbDto) {
    return this.prisma.linuxBackDb.create({
      data: {
        ...(dto.id && { id: dto.id }),
        backId: dto.backId,
        dbName: dto.dbName,
        elapsedMs: dto.elapsedMs,
      },
    });
  }

  async createLinuxBackTbl(dto: CreateLinuxBackTblDto) {
    return this.prisma.linuxBackTbl.create({
      data: {
        backDbId: dto.backDbId,
        tblName: dto.tblName,
        elapsedMs: dto.elapsedMs,
        errorMessage: dto.errorMessage ?? null,
      },
    });
  }
}
