import { Injectable } from '@nestjs/common';
import { SaveErrorLogDto } from './dto/save-error-log.dto';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { SettingRecordData } from './types/setting-record-data';
import { ApiProperty } from '@nestjs/swagger';
import { SaveSettingResponseDto } from './dto/setting-record.dto';

@Injectable()
export class ClickService {
  constructor(private prisma: ClickPrismaService) { }

  getErrorLogs({ startDate, endDate }: { startDate: string, endDate: string }) {
    const isoStartDate = new Date(startDate);
    const isoEndDate = new Date(endDate);

    return this.prisma.errorLog.findMany({
      where: {
        createdAt: { gte: isoStartDate, lte: isoEndDate },
      },
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
      orderBy: { createdAt: 'desc' },
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

  async saveSettingRecord(dto: { ykiho: string; useSilsonbohum?: boolean | undefined; }) {
    const existingRecord = await this.prisma.settingRecord.findUnique({
      where: { ykiho: dto.ykiho }
    });

    const data: SettingRecordData = (existingRecord?.data as SettingRecordData) || {};
    if (dto.useSilsonbohum !== undefined) {
      data.silsonbohum = { ...data.silsonbohum, use: dto.useSilsonbohum };
    }

    const record = await this.prisma.settingRecord.upsert({
      where: { ykiho: dto.ykiho },
      update: { data },
      create: { ykiho: dto.ykiho, data },
    });

    return new SaveSettingResponseDto(record);
  }

  async getSettingRecord(ykiho: string) {
    const record = await this.prisma.settingRecord.findUnique({ where: { ykiho } });
    return record?.data as SettingRecordData;
  }
}
