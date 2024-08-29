import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const existsSurveyParamsSchema = z.object({
  ver: z.string(),
  ykiho: z.string(),
  userId: z.string(),
});


export class ExistsSurveyParamsDto implements z.infer<typeof existsSurveyParamsSchema> {
  @ApiProperty({description:"버전", example: "24.12"})
  ver: string;
  @ApiProperty({description:"요양기관기호", example: "10170068"})
  ykiho: string;
  @ApiProperty({description:"사용자아이디", example: "z"})
  userId: string;
}