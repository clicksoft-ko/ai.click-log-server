import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateLinuxBackTblSchema = z.object({
  backDbId: z.string().uuid(),
  tblName: z.string().max(30),
  elapsedMs: z.number().int(),
  errorMessage: z.string().optional(),
});

export class CreateLinuxBackTblDto
  implements z.infer<typeof CreateLinuxBackTblSchema>
{
  @ApiProperty({ description: 'linux_back_db ID' })
  backDbId: string;

  @ApiProperty({ maxLength: 30, description: '테이블 이름' })
  tblName: string;

  @ApiProperty({ description: '소요 시간(ms)' })
  elapsedMs: number;

  @ApiPropertyOptional({ description: '에러 메시지' })
  errorMessage?: string;
}
