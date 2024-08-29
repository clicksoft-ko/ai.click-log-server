import { Global, Module } from '@nestjs/common';
import { ClickPrismaService } from './click-prisma.service';
import { CpmPrismaService } from './cpm-prisma.service';

@Global()
@Module({
  providers: [ClickPrismaService, CpmPrismaService],
  exports: [ClickPrismaService, CpmPrismaService],
})
export class PrismaModule { }
