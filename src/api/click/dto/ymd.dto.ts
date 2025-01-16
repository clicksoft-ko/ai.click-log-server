import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const YmdSchema = z.object({
  ymd: z
    .string()
    .length(8)
    .regex(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/)
    .describe('yyyyMMdd 형식'),
});

export class YmdDto {
  @ApiProperty({ description: '년월일(yyyyMMdd)', example: '20230101' })
  ymd: string;
}
