import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SettingRecordData, SilsonBohumConfig } from "../types/setting-record-data";
import { z } from "zod";

export class SilsonBohumConfigDto implements SilsonBohumConfig {
  @ApiPropertyOptional({ description: '실손보험 사용 여부' })
  use?: boolean;
}

export class SettingRecordDto implements SettingRecordData {
  @ApiPropertyOptional({ type: SilsonBohumConfigDto, description: '실손보험 설정' })
  silsonbohum?: SilsonBohumConfig;
}

export class SaveSettingResponseDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '요양기관기호' })
  ykiho: string;

  @ApiProperty({ description: '마지막 업데이트 일시' })
  updatedAt: Date;

  constructor(data: SaveSettingResponseDto) {
    this.id = data.id;
    this.ykiho = data.ykiho;
    this.updatedAt = data.updatedAt;
  }
}

export const SaveSettingRecordSchema = z.object({
  useSilsonbohum: z.boolean().optional(),
});

export class SaveSettingRequestDto implements z.infer<typeof SaveSettingRecordSchema> {
  @ApiPropertyOptional({ description: '실손보험 사용 여부', example: true })
  useSilsonbohum?: boolean;
}
