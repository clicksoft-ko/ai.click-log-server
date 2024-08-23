import { z } from "zod";

export const ErrorLogSchema = z.object({
  ykiho: z.string().max(8),
  computerName: z.string().max(50), // VarChar(255)에 대응
  moduleName: z.string().max(20),
  logLevel: z.string().max(50), // VarChar(50)에 대응
  exceptionType: z.string().max(50),
  errorMessage: z.string(), // Text 필드에 대응
  stackTrace: z.string().nullable(), // Nullable Text 필드에 대응
  source: z.string().max(255).nullable(), // VarChar(255)이고 nullable  
  additionalData: z.record(z.any()), // Json 필드에 대응
});

export type SaveErrorLogDto = z.infer<typeof ErrorLogSchema>;