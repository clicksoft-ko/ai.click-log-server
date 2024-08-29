import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const rejectSurveySchema = z.object({
  ver: z.string(),
  ykiho: z.string(),
  ykihoName: z.string(),
  userId: z.string(),
  bu: z.string(),
  buName: z.string(),
  sebu: z.string(),
  sebuName: z.string(),
  computerName: z.string(),
});

export class RejectSurveyDto {
  @ApiProperty({ description: "버전", example: "24.12" })
  ver: string;
  @ApiProperty({ description: "요양기관기호", example: "10170068" })
  ykiho: string;
  @ApiProperty({ description: "요양기관명칭", example: "클릭요양병원" })
  ykihoName: string;
  @ApiProperty({ description: "사용자아이디", example: "z" })
  userId: string;
  @ApiProperty({ description: "부서코드", example: "04" })
  bu: string;
  @ApiProperty({ description: "부서명칭", example: "물리치료실" })
  buName: string;
  @ApiProperty({ description: "세부부서코드", example: "03" })
  sebu: string;
  @ApiProperty({ description: "세부부서명칭", example: "운동치료실" })
  sebuName: string;
  @ApiProperty({ description: "컴퓨터명칭", example: "COM-01" })
  computerName: string;
}