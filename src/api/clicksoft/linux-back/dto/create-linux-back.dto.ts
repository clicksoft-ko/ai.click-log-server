import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateLinuxBackSchema = z.object({
  id: z.string().uuid().optional(),
  ykiho: z.string().max(8),
  key: z.string().max(20),
  backupPath: z.string(),
  startedAt: z.string().datetime(),
});

export class CreateLinuxBackDto implements z.infer<typeof CreateLinuxBackSchema> {
  @ApiPropertyOptional({ description: 'UUID (미전달 시 자동 생성)' })
  id?: string;

  @ApiProperty({ maxLength: 8, description: '요양기관 코드' })
  ykiho: string;

  @ApiProperty({ maxLength: 20, description: '백업 키' })
  key: string;

  @ApiProperty({ description: '백업 경로' })
  backupPath: string;

  @ApiProperty({ description: '백업 시작 시간 (ISO datetime)' })
  startedAt: string;
}
