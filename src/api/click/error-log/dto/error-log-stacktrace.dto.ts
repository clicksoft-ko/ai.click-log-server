import { ApiProperty } from "@nestjs/swagger";

export class ErrorLogStacktraceDto {
  @ApiProperty()
  stackTrace: string;
}