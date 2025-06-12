import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmService {
  constructor(private readonly prisma: CpmPrismaService) {}

  async getByCode(code: string) {
    return this.prisma.em.findUnique({
      where: { code },
    });
  }
}
