import { ApiProperty } from "@nestjs/swagger";
import { CustomerSurvey, Prisma } from "prisma/generated/cpm-schema-client";

export class CustomerSurveyDto implements CustomerSurvey {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ver: string;
  @ApiProperty()
  ykiho: string;
  @ApiProperty()
  ykihoName: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  bu: string;
  @ApiProperty()
  buName: string;
  @ApiProperty()
  sebu: string;
  @ApiProperty()
  sebuName: string;
  @ApiProperty()
  computerName: string;
  @ApiProperty()
  reject: boolean;
  @ApiProperty()
  surveyDate: Date;
  @ApiProperty()
  q1_1: number;
  @ApiProperty()
  q1_2: number;
  @ApiProperty()
  q1_3: number;
  @ApiProperty()
  q2_1: number;
  @ApiProperty()
  q2_2: number;
  @ApiProperty()
  q2_3: number;
  @ApiProperty()
  q3_1: number;
  @ApiProperty()
  q3_2: number;
  @ApiProperty()
  q4_1: number;
  @ApiProperty()
  q4_2: number;
  @ApiProperty()
  q4_3: number;
  @ApiProperty({example: "", required: false})
  text1: string | null;
  @ApiProperty({example: "", required: false})
  text2: string | null;
}