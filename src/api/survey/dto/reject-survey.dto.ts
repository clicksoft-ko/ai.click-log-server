import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const rejectSurveySchema = z.object({
  ver: z.string(),
  ykiho: z.string(),
  userId: z.string(),
  buName: z.string(),
  sebuName: z.string(),
  computerName: z.string(),
});

export class RejectSurveyDto {
  @ApiProperty({ description: "버전", example: "24.12" })
  ver: string;
  @ApiProperty({ description: "요양기관기호", example: "10170068" })
  ykiho: string;
  @ApiProperty({ description: "사용자아이디", example: "z" })
  userId: string;
  @ApiProperty({ description: "부서명칭", example: "물리치료실" })
  buName: string;
  @ApiProperty({ description: "세부부서명칭", example: "운동치료실" })
  sebuName: string;
  @ApiProperty({ description: "컴퓨터명칭", example: "COM-01" })
  computerName: string;
}