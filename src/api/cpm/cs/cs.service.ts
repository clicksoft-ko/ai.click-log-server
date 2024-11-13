import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CsService {
  constructor(private prisma: CpmPrismaService) { }

  async getNames() {
    const css = await this.prisma.cs.findMany({
      select: {
        code: true,
        myung: true,
      },
    });

    return {
      totalCount: css.length,
      data: css,
    };
  }
}
