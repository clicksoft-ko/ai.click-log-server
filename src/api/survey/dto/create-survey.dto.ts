import { ApiProperty, PartialType } from "@nestjs/swagger";
import { RejectSurveyDto, rejectSurveySchema } from "./reject-survey.dto";
import { z } from "zod";

export const createSurveySchema = rejectSurveySchema.extend({
  q1_1: z.number().min(1).max(5),
  q1_2: z.number().min(1).max(5),
  q1_3: z.number().min(1).max(5),
  q2_1: z.number().min(1).max(5),
  q2_2: z.number().min(1).max(5),
  q2_3: z.number().min(1).max(5),
  q3_1: z.number().min(1).max(5),
  q3_2: z.number().min(1).max(5),
  q4_1: z.number().min(1).max(5),
  q4_2: z.number().min(1).max(5),
  q4_3: z.number().min(1).max(5),
  text1: z.string().optional(),
  text2: z.string().optional(),
});

export class CreateSurveyDto extends RejectSurveyDto {
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q1_1: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "2" })
  q1_2: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "3" })
  q1_3: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "4" })
  q2_1: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "5" })
  q2_2: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q2_3: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q3_1: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q3_2: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q4_1: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q4_2: number;
  @ApiProperty({ description: "문항 값 (1~5)", example: "1" })
  q4_3: number;
  @ApiProperty({ description: "직접 입력", example: "기타 입력 내용", required: false })
  text1?: string;
  @ApiProperty({ description: "직접 입력2", example: "기타 입력 내용 2", required: false })
  text2?: string;
}

