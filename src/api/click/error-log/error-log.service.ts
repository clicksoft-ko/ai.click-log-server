import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { Injectable } from '@nestjs/common';
import { SaveErrorLogDto } from './dto/save-error-log.dto';

@Injectable()
export class ErrorLogService {
  constructor(private prisma: ClickPrismaService) { }

  async getErrorLogs({ 
    startDate, 
    endDate, 
    cursor, 
    take = 20 
  }: { 
    startDate: string, 
    endDate: string,
    cursor?: number,
    take?: number 
  }) {
    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    return await this.prisma.errorLog.findMany({
      where: {
        createdAt: { gte: isoStartDate, lte: isoEndDate },
        ...(cursor && { id: { lt: cursor } })
      },
      take,
      select: {
        id: true,
        createdAt: true,
        ykiho: true,
        computerName: true,
        moduleName: true,
        logLevel: true,
        exceptionType: true,
        errorMessage: true,
        source: true,
        additionalData: true,
        clientVersion: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  saveErrorLog(dto: SaveErrorLogDto, ip: string | undefined) {
    return this.prisma.errorLog.create({
      data: {
        ykiho: dto.ykiho,
        computerName: dto.computerName,
        moduleName: dto.moduleName,
        logLevel: dto.logLevel,
        exceptionType: dto.exceptionType,
        errorMessage: dto.errorMessage,
        stackTrace: dto.stackTrace || null,
        source: dto.source || null,
        additionalData: { ...dto.additionalData, ip },
        clientVersion: dto.clientVersion,
      },
    });
  }

  async getStacktrace(id: number) {
    const errorLog = await this.prisma.errorLog.findUnique({ select: { stackTrace: true }, where: { id } });
    return { stackTrace: errorLog?.stackTrace };
  }
}
