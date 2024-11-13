import { Injectable } from '@nestjs/common';
import { SaveErrorLogDto } from './error-log/dto/save-error-log.dto';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { SettingRecordData } from './types/setting-record-data';
import { ApiProperty } from '@nestjs/swagger';
import { SaveSettingResponseDto } from './dto/setting-record.dto';

@Injectable()
export class ClickService {
  constructor(private prisma: ClickPrismaService) { }

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
