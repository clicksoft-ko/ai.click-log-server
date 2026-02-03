import { Global, Module } from '@nestjs/common';
import { ClickPrismaService } from './click-prisma.service';
import { CpmPrismaService } from './cpm-prisma.service';
import { CollectDbPrismaService } from './collect-db-prisma.service';
import { ClickSoftPrismaService } from './click-soft-prisma.service';

@Global()
@Module({
  providers: [
    ClickPrismaService,
    CpmPrismaService,
    CollectDbPrismaService,
    ClickSoftPrismaService,
  ],
  exports: [
    ClickPrismaService,
    CpmPrismaService,
    CollectDbPrismaService,
    ClickSoftPrismaService,
  ],
})
export class PrismaModule {}
