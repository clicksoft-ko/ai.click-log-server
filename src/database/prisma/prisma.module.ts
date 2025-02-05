import { Global, Module } from '@nestjs/common';
import { ClickPrismaService } from './click-prisma.service';
import { CpmPrismaService } from './cpm-prisma.service';
import { CollectDbPrismaService } from './collect-db-prisma.service';

@Global()
@Module({
  providers: [ClickPrismaService, CpmPrismaService, CollectDbPrismaService],
  exports: [ClickPrismaService, CpmPrismaService, CollectDbPrismaService],
})
export class PrismaModule {}
