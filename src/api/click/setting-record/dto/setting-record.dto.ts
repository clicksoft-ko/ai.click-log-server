import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { MedihomeConfig, medihomeConfigSchema } from './medihome-config.dto';

export class SettingRecordDto {
  @ApiPropertyOptional({
    type: MedihomeConfig,
    description: '실손보험 설정',
  })
  medihome?: MedihomeConfig;
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
  medihome: medihomeConfigSchema.optional(),
});

export class SaveSettingRequestDto
  implements z.infer<typeof SaveSettingRecordSchema>
{
  @ApiPropertyOptional({ description: '실손보험 사용 여부', example: true })
  medihome?: MedihomeConfig;
}
