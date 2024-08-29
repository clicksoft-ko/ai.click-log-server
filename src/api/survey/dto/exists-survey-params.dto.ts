import { z } from "zod";

export const existsSurveyParamsSchema = z.object({
  ver: z.string(),
  ykiho: z.string(),
  userId: z.string(),
});


export class ExistsSurveyParamsDto implements z.infer<typeof existsSurveyParamsSchema> {
  ver: string;
  ykiho: string;
  userId: string;
}