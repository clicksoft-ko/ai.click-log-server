import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateLinuxBackSchema = z.object({
  endedAt: z.string().datetime(),
});

export class UpdateLinuxBackDto implements z.infer<typeof UpdateLinuxBackSchema> {
  @ApiProperty({ description: '백업 종료 시간 (ISO datetime)' })
  endedAt: string;
}
