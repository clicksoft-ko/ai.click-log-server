import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const DateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export class DateRangeDto {
  @ApiProperty({ description: '조회 시작 날짜' })
  startDate: string;

  @ApiProperty({ description: '조회 종료 날짜 (해당 시각 미포함)' })
  endDate: string;
}
