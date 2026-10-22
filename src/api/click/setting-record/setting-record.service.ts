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

    if (dto.medihome !== undefined) data.medihome = dto.medihome;
    if (dto.baseList !== undefined) data.baseList = dto.baseList;

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

  async getSettingRecord(ykiho: string, code?: string) {
    const record = await this.prisma.settingRecord.findUnique({
      where: { ykiho },
    });
    const data = record?.data as SettingRecordDto | undefined;
    if (!data || code === undefined) {
      return data;
    }
    return this.filterBaseListByCode(data, code);
  }

  async getAllSettingRecords(code?: string) {
    const records = await this.prisma.settingRecord.findMany();
    const result = records.map((record) => ({
      ykiho: record.ykiho,
      data: record.data as SettingRecordDto,
    }));
    if (code === undefined) {
      return result;
    }

    // code 가 일치하는 baseList 항목이 하나라도 있는 기관만 반환
    return result
      .map((record) => ({
        ...record,
        data: this.filterBaseListByCode(record.data, code),
      }))
      .filter((record) => (record.data?.baseList?.length ?? 0) > 0);
  }

  private filterBaseListByCode(
    data: SettingRecordDto,
    code: string,
  ): SettingRecordDto {
    if (!Array.isArray(data?.baseList)) {
      return data;
    }

    const target = code.toLowerCase();
    return {
      ...data,
      baseList: data.baseList.filter(
        (item) =>
          item?.code != null && String(item.code).toLowerCase() === target,
      ),
    };
  }
}
