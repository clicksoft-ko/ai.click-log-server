import { ApiProperty } from "@nestjs/swagger";
import { ErrorLog } from "prisma/generated/click-schema-client";

export class ErrorLogDto implements ErrorLog {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ykiho: string;

  @ApiProperty()
  computerName: string;

  @ApiProperty()
  moduleName: string;

  @ApiProperty({ default: "" })
  clientVersion: string;

  @ApiProperty()
  logLevel: string;

  @ApiProperty()
  exceptionType: string;

  @ApiProperty()
  errorMessage: string;

  @ApiProperty({ type: String, nullable: true })
  stackTrace: string | null;

  @ApiProperty({ type: String, nullable: true })
  source: string | null;

  @ApiProperty({
    type: 'object',
    description: '추가 데이터(JSON 형식)',
    example: {
      "gc": {
        "gen0": 24,
        "gen1": 18,
        "gen2": 6,
        "totalMemory": "25.89MB"
      },
      "ip": "106.255.241.66",
      "os": {
        "name": "Windows 11",
        "major": 10,
        "minor": 0,
        "buildNumber": 22631
      },
      "user": {
        "id": "z",
        "name": "클릭소프트"
      },
      "process": {
        "paged": "132.67MB",
        "private": "132.67MB",
        "virtual": "684.49MB",
        "working": "189.67MB",
        "threadId": 1
      }
    }
  })
  additionalData: object;

  @ApiProperty()
  createdAt: Date;
}