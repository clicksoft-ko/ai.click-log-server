import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const medihomeConfigSchema = z.object({
  use: z.enum(['prod', 'test', 'no']).optional(),
  companyName: z.string().optional(),
  gatewayDrive: z.string().optional(),
  gatewayIp: z.string().optional(),
  gatewayPort: z.number().optional(),
  gatewaySport: z.number().optional(),
  waitingMinutes: z.number().optional(),
  waitingCount: z.number().optional(),
  reservationHours: z.number().optional(),
  requestSms: z.enum(['direct', 'reception', 'payment']).optional(),
  requestSmsDefaultPrice: z.number().optional(),
  useMiddlePayment: z.boolean().optional(),
  introduction: z.string().optional(),
  smsType: z.enum(['click', 'kakako', 'etc']).optional(),
  reservationDeptCode: z
    .array(
      z.string().regex(/^\d{2}$/, '진료실 코드는 `두자리 숫자`여야합니다.'),
    )
    .optional(),
});

export enum MedihomeUse {
  prod = 'prod',
  test = 'test',
  no = 'no',
}

export enum RequestSms {
  direct = 'direct', // 직접 전송
  reception = 'reception', // 접수시 전송
  payment = 'payment', // 수납시 전송
}

export enum SmsType {
  click = 'click',
  kakako = 'kakako',
  etc = 'etc',
}
export class MedihomeConfig implements z.infer<typeof medihomeConfigSchema> {
  @ApiProperty({
    enum: MedihomeUse,
    enumName: 'MedihomeUse',
    description: '사용여부(prod: 실운영, test: 테스트, no: 사용안함)',
    required: false,
    example: 'prod',
  })
  use?: MedihomeUse;

  @ApiProperty({
    description: '업체명',
    required: false,
    example: '메디홈 병원',
  })
  companyName?: string;

  @ApiProperty({
    description: '게이트웨이 설치 드라이브',
    required: false,
    example: 'C:/',
  })
  gatewayDrive?: string;

  @ApiProperty({
    description: '게이트웨이 아이피',
    required: false,
    example: '192.168.0.1',
  })
  gatewayIp?: string;

  @ApiProperty({
    description: '게이트웨이 포트',
    required: false,
    type: Number,
    example: 8080,
  })
  gatewayPort?: number;

  @ApiProperty({
    description: '게이트웨이 S-포트',
    required: false,
    type: Number,
    example: 8081,
  })
  gatewaySport?: number;

  @ApiProperty({
    description: '1인 진료대기시간',
    required: false,
    type: Number,
    example: 15,
  })
  waitingMinutes?: number;

  @ApiProperty({
    description: '대기순번알림 인원',
    required: false,
    type: Number,
    example: 3,
  })
  waitingCount?: number;

  @ApiProperty({
    description: '예약 ? 시간 전 알림',
    required: false,
    type: Number,
    example: 24,
  })
  reservationHours?: number;

  @ApiProperty({
    enum: RequestSms,
    description:
      'SMS요청(direct: 직접전송, reception: 접수시전송, payment: 수납시전송)',
    required: false,
    example: 'direct',
  })
  requestSms?: RequestSms;

  @ApiProperty({
    description: 'SMS요청 기본 금액',
    required: false,
    type: Number,
    example: 1000,
  })
  requestSmsDefaultPrice?: number;

  @ApiProperty({
    description: '입원 중간수납 사용여부',
    required: false,
    type: Boolean,
    example: true,
  })
  useMiddlePayment?: boolean;

  @ApiProperty({
    description: '병원 소개',
    required: false,
    example: '환자 중심 진료를 실천하는 메디홈 병원입니다.',
  })
  introduction?: string;

  @ApiProperty({
    enum: SmsType,
    description: '문자서비스 종류(click: 클릭, kakako: 카카오톡, etc: 기타)',
    required: false,
    example: 'click',
  })
  smsType?: SmsType;

  @ApiProperty({
    description: '예약가능 진료과코드',
    required: false,
    type: [String],
    example: ['01', '03', '07'],
  })
  reservationDeptCode?: string[];
}
