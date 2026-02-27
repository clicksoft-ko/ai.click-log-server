import { ClickSoftPrismaService } from '@/database/prisma/click-soft-prisma.service';
import { Injectable } from '@nestjs/common';
import type { BackupType, Prisma } from 'generated/clicksoft-schema-client/client';
import { CreateLinuxBackDto } from './dto/create-linux-back.dto';
import { UpdateLinuxBackDto } from './dto/update-linux-back.dto';
import { CreateLinuxBackDbDto } from './dto/create-linux-back-db.dto';
import { CreateLinuxBackTblDto } from './dto/create-linux-back-tbl.dto';

const linuxBackWithErrorTblsInclude = {
  dbs: {
    include: {
      tbls: {
        where: {
          errorMessage: {
            not: null,
          },
        },
        select: {
          tblName: true,
          errorMessage: true,
          createdAt: true,
        },
      },
    },
  },
} as const satisfies Prisma.LinuxBackInclude;

type LinuxBackWithErrorTbls = Prisma.LinuxBackGetPayload<{
  include: typeof linuxBackWithErrorTblsInclude;
}>;

type LinuxBackDbWithErrorTbls = LinuxBackWithErrorTbls['dbs'][number];

@Injectable()
export class LinuxBackService {
  constructor(private prisma: ClickSoftPrismaService) {}

  private async getLatestIdsByYkihoAndKey(backupType?: BackupType) {
    const rows = backupType
      ? await this.prisma.$queryRaw<Array<{ id: string }>>`
          SELECT DISTINCT ON ("ykiho", "key") "id"
          FROM "linux_back"
          WHERE "backup_type" = ${backupType}::"backup_type"
          ORDER BY "ykiho", "key", "id" DESC
        `
      : await this.prisma.$queryRaw<Array<{ id: string }>>`
          SELECT DISTINCT ON ("ykiho", "key") "id"
          FROM "linux_back"
          ORDER BY "ykiho", "key", "id" DESC
        `;

    return rows.map((row) => row.id);
  }

  private async getLatestIdsByKeyForYkiho(ykiho: string, backupType?: BackupType) {
    const rows = backupType
      ? await this.prisma.$queryRaw<Array<{ id: string }>>`
          SELECT DISTINCT ON ("key") "id"
          FROM "linux_back"
          WHERE "ykiho" = ${ykiho} AND "backup_type" = ${backupType}::"backup_type"
          ORDER BY "key", "id" DESC
        `
      : await this.prisma.$queryRaw<Array<{ id: string }>>`
          SELECT DISTINCT ON ("key") "id"
          FROM "linux_back"
          WHERE "ykiho" = ${ykiho}
          ORDER BY "key", "id" DESC
        `;

    return rows.map((row) => row.id);
  }

  private async findLinuxBacksByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const latestBacks = await this.prisma.linuxBack.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      orderBy: { id: 'desc' },
      include: linuxBackWithErrorTblsInclude,
    });

    return latestBacks.map((back) => this.mapBackWithErrorLogs(back));
  }

  private mapBackWithErrorLogs(back: LinuxBackWithErrorTbls) {
    return {
      ...back,
      dbs: back.dbs.map(({ tbls, ...db }: LinuxBackDbWithErrorTbls) => {
        const errorLogs = tbls.flatMap((tbl) =>
          tbl.errorMessage
            ? [
                {
                  tblName: tbl.tblName,
                  errorMessage: tbl.errorMessage,
                  createdAt: tbl.createdAt,
                },
              ]
            : [],
        );

        return {
          ...db,
          ...(errorLogs.length > 0 ? { errorLogs } : {}),
        };
      }),
    };
  }

  async createLinuxBack(dto: CreateLinuxBackDto) {
    return this.prisma.linuxBack.create({
      data: {
        ...(dto.id && { id: dto.id }),
        ykiho: dto.ykiho,
        key: dto.key,
        backupType: dto.backupType,
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

  async getLatestLinuxBacks(backupType?: BackupType) {
    const latestIds = await this.getLatestIdsByYkihoAndKey(backupType);
    return this.findLinuxBacksByIds(latestIds);
  }

  async getLatestLinuxBackByYkiho(ykiho: string, backupType?: BackupType) {
    const latestIds = await this.getLatestIdsByKeyForYkiho(ykiho, backupType);
    return this.findLinuxBacksByIds(latestIds);
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
    const result = await this.prisma.linuxBackTbl.create({
      data: {
        backDbId: dto.backDbId,
        tblName: dto.tblName,
        elapsedMs: dto.elapsedMs,
        errorMessage: dto.errorMessage ?? null,
      },
    });

    return {
      ...result,
      id: Number(result.id),
    };
  }
}
