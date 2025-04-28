import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { Injectable } from '@nestjs/common';
import {
  SaveSettingResponseDto,
  SettingRecordDto,
} from './dto/setting-record.dto';

@Injectable()
export class SettingRecordService {
  constructor(private prisma: ClickPrismaService) {}

  async saveSettingRecord({
    ykiho,
    dto,
  }: {
    ykiho: string;
    dto: SettingRecordDto;
  }) {
    const existingRecord = await this.prisma.settingRecord.findUnique({
      where: { ykiho },
    });

    const data: SettingRecordDto =
      (existingRecord?.data as SettingRecordDto) || {};

    if (dto.medihome) {
      data.medihome = dto.medihome;
    }
    const newTypedData: Record<string, any> = data;

    const record = await this.prisma.settingRecord.upsert({
      where: { ykiho },
      update: { data: newTypedData },
      create: { ykiho, data: newTypedData },
    });

    return new SaveSettingResponseDto({
      id: record.id,
      ykiho: ykiho,
      updatedAt: new Date(),
      data: record.data as any,
    });
  }

  async getSettingRecord(ykiho: string) {
    const record = await this.prisma.settingRecord.findUnique({
      where: { ykiho },
    });
    return record?.data;
  }

  async getAllSettingRecords() {
    const records = await this.prisma.settingRecord.findMany();
    return records.map((record) => ({
      ykiho: record.ykiho,
      data: record.data,
    }));
  }
}
