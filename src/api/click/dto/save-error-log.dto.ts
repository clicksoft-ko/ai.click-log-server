import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";

export const ErrorLogSchema = z.object({
  ykiho: z.string().max(8),
  computerName: z.string().max(50), // VarChar(255)에 대응
  moduleName: z.string().max(50),
  clientVersion: z.string().max(20).default(""),
  logLevel: z.string().max(50), // VarChar(50)에 대응
  exceptionType: z.string().max(50),
  errorMessage: z.string(), // Text 필드에 대응
  stackTrace: z.string().nullable(), // Nullable Text 필드에 대응
  source: z.string().max(255).nullable(), // VarChar(255)이고 nullable  
  additionalData: z.record(z.any()), // Json 필드에 대응
}); 
export class SaveErrorLogDto implements z.infer<typeof ErrorLogSchema>{
  @ApiProperty({ maxLength: 8, description: 'YKIHO 코드' })
  ykiho: string;

  @ApiProperty({ maxLength: 50, description: '컴퓨터 이름' })
  computerName: string;

  @ApiProperty({ maxLength: 50, description: '모듈 이름' })
  moduleName: string;

  @ApiPropertyOptional({ maxLength: 20, description: '클라이언트 버전 (기본값: 빈 문자열)' })
  clientVersion: string = '';

  @ApiProperty({ maxLength: 50, description: '로그 레벨' })
  logLevel: string;

  @ApiProperty({ maxLength: 50, description: '예외 유형' })
  exceptionType: string;

  @ApiProperty({ description: '에러 메시지' })
  errorMessage: string;

  @ApiPropertyOptional({ nullable: true, description: '스택 트레이스' })
  stackTrace: string | null;

  @ApiPropertyOptional({ maxLength: 255, nullable: true, description: '소스', example: "csp" })
  source: string | null;

  @ApiProperty({ type: 'object', description: '추가 데이터 (JSON)' })
  additionalData: Record<string, any>;
}