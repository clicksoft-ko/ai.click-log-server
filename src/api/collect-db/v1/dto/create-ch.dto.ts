import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateChInfoSchema = z.object({
  sex: z.string().length(1),
  age: z.number().int(),
  birthday: z.string().length(8),
});

export const CreateChSkSchema = z.object({
  code: z.string().max(6),
  ymd: z.string().length(8),
  specialCode: z.string().max(4),
  result: z.string().max(1),
});

export const CreateChJySchema = z.object({
  ycode: z.string().max(9),
  myung: z.string().max(100),
  ilto: z.number(),
  haesu: z.number().int(),
  chongto: z.number().int(),
  gnDup: z.number().int(),
});

export const CreateChJcSchema = z.object({
  spGubun: z.string().max(1),
  spCode: z.string().max(8),
  gnDup: z.number().int(),
});

export const CreateChSchema = z.object({
  ykiho: z.string().length(8),
  gubun: z.string().length(1),
  chasu: z.string().length(1),
  week: z.string().length(1),
  saup: z.string().length(2),
  chart: z.string().length(8),
  weibgu: z.string().length(1),
  yuhyung: z.string().length(2),
  ackgubun: z.string(),
  dup: z.number().int(),
  symd: z.string().length(8),
  eymd: z.string().length(8).default(''),
  ibymd: z.string().length(8).default(''),
  fibymd: z.string().length(8).default(''),
  info: CreateChInfoSchema,
  sk: z.array(CreateChSkSchema),
  jy: z.array(CreateChJySchema),
  jc: z.array(CreateChJcSchema).optional(),
});

export class CreateChInfoDto {
  @ApiProperty({ description: '성별', example: 'M' })
  sex: string;

  @ApiProperty({ description: '나이', example: 30 })
  age: number;

  @ApiProperty({ description: '생년월일', example: '19900101' })
  birthday: string;
}

export class CreateChSkDto {
  @ApiProperty({ description: '코드', example: '123456' })
  code: string;

  @ApiProperty({ description: '날짜', example: '20230101' })
  ymd: string;

  @ApiProperty({ description: '특별 코드', example: '1234' })
  specialCode: string;

  @ApiProperty({ description: '결과', example: 'Y' })
  result: string;
}

export class CreateChJyDto {
  @ApiProperty({ description: 'Y 코드', example: '123456789' })
  ycode: string;

  @ApiProperty({ description: '명칭', example: '샘플 명칭' })
  myung: string;

  @ApiProperty({ description: '일토', example: 1.5 })
  ilto: number;

  @ApiProperty({ description: '해수', example: 2 })
  haesu: number;

  @ApiProperty({ description: '총토', example: 3 })
  chongto: number;

  @ApiProperty({ description: 'GN 중복', example: 1 })
  gnDup: number;
}

export class CreateChJcDto {
  @ApiProperty({ description: 'SP 구분', example: 'A' })
  spGubun: string;

  @ApiProperty({ description: 'SP 코드', example: '12345678' })
  spCode: string;

  @ApiProperty({ description: 'GN 중복', example: 1 })
  gnDup: number;
}

export class CreateChDto implements z.infer<typeof CreateChSchema> {
  @ApiProperty({ description: '요양기관기호', example: '12345678' })
  ykiho: string;

  @ApiProperty({ description: '청구유형구분', example: '1' })
  gubun: string;

  @ApiProperty({ description: '청구차수', example: '1' })
  chasu: string;

  @ApiProperty({ description: '주단위 청구 구분 값', example: '1' })
  week: string;

  @ApiProperty({ description: '사업', example: '01' })
  saup: string;

  @ApiProperty({ description: '차트', example: '12345678' })
  chart: string;

  @ApiProperty({ description: '외/입', example: '1' })
  weibgu: string;

  @ApiProperty({ description: '유형', example: '01' })
  yuhyung: string;

  @ApiProperty({ description: 'ACK구분', example: '001' })
  ackgubun: string;

  @ApiProperty({ description: '순번', example: 1 })
  dup: number;

  @ApiProperty({ description: '시작일자', example: '20230101' })
  symd: string;

  @ApiProperty({ description: '종료일자', example: '20231231' })
  eymd: string;

  @ApiProperty({ description: '입원일자', example: '20230101' })
  ibymd: string;

  @ApiProperty({ description: '퇴원일자', example: '20231231' })
  fibymd: string;

  @ApiProperty({ description: '청구정보', type: CreateChInfoDto })
  info: CreateChInfoDto;

  @ApiProperty({ description: '상병', type: [CreateChSkDto] })
  sk: CreateChSkDto[];

  @ApiProperty({ description: '진료내역', type: [CreateChJyDto] })
  jy: CreateChJyDto[];

  @ApiProperty({ description: '참고사항', type: [CreateChJcDto] })
  jc?: CreateChJcDto[];
}
