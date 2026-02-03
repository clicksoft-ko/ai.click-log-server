import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateLinuxBackDbSchema = z.object({
  id: z.string().uuid().optional(),
  backId: z.string().uuid(),
  dbName: z.string().max(30),
  elapsedMs: z.number().int(),
});

export class CreateLinuxBackDbDto
  implements z.infer<typeof CreateLinuxBackDbSchema>
{
  @ApiPropertyOptional({ description: 'UUID (미전달 시 자동 생성)' })
  id?: string;

  @ApiProperty({ description: 'linux_back ID' })
  backId: string;

  @ApiProperty({ maxLength: 30, description: 'DB 이름' })
  dbName: string;

  @ApiProperty({ description: '소요 시간(ms)' })
  elapsedMs: number;
}
