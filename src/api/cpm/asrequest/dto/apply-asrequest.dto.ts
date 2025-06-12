import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ApplyAsSchema = z.object({
  ascode: z.string().min(1, '부가서비스 코드는 필수입니다').trim(),
  asmyung: z.string().min(1, '부가서비스 명칭은 필수입니다').trim(),
  yoyangno: z
    .string()
    .length(8, '요양기관기호는 8자리여야 합니다')
    .regex(/^[0-9]+$/, '요양기관기호는 숫자만 포함해야 합니다')
    .trim(),
  hosdamdang: z.string().min(1, '담당자명은 필수입니다').trim(),
  hosdamdangtel: z.string().min(1, '담당자연락처는 필수입니다').trim(),
});

export class ApplyAsRequestDto implements z.infer<typeof ApplyAsSchema> {
  @ApiProperty({
    description: '부가서비스 코드',
    example: '999',
  })
  ascode: string;

  @ApiProperty({
    description: '부가서비스 명칭',
    example: 'Tablet 동의서',
  })
  asmyung: string;

  @ApiProperty({
    description: '요양기관기호 (8자리 숫자)',
    example: '10170068',
  })
  yoyangno: string;

  @ApiProperty({
    description: '담당자명',
    example: '홍길동',
  })
  hosdamdang: string;

  @ApiProperty({
    description: '담당자연락처',
    example: '01012345678',
  })
  hosdamdangtel: string;
}
