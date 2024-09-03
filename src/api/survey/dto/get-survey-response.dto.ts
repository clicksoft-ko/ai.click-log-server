import { ApiProperty } from "@nestjs/swagger";
import { SurveyPeriod } from "prisma/generated/cpm-schema-client";

export class GetSurveyResponseDto implements SurveyPeriod {
  @ApiProperty({
    description: '설문조사 버전',
    example: 'v1.0'
  })
  ver: string;

  @ApiProperty({
    description: '설문조사 시작 날짜',
    example: '20230101'
  })
  symd: string;

  @ApiProperty({
    description: '설문조사 종료 날짜',
    example: '20231231'
  })
  eymd: string;
}