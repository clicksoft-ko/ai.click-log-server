import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const getSurveyParamsSchema = z.object({
  ykiho: z.string().min(1),
  userId: z.string().min(1),
});

export class GetSurveyParamsDto implements z.infer<typeof getSurveyParamsSchema> {   
  @ApiProperty({description:"요양기관기호", example: "10170068"})
  ykiho: string;
  @ApiProperty({description:"사용자아이디", example: "z"})
  userId: string;
}