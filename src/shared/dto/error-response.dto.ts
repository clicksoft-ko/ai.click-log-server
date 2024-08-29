import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    example: 400,
  })
  @ApiProperty()
  statusCode: number;
  @ApiProperty({
    description: '오류가 발생한 타임스탬프',
    example: '2024-08-29T02:09:20.964Z',
  })
  timestamp: string;
  @ApiProperty({
    description: '요청 경로',
    example: '/api/survey/exists?ykiho=1234567890&userId=user123',
  })
  path: string;

  @ApiProperty({
    description: '오류 메시지',
    example: 'Validation error on ("data": Required)',
  })
  message: string | object;

  @ApiProperty({
    description: '유효성 검사 오류가 발생한 필드와 해당 오류 메시지 목록',
    type: 'object',  // Swagger에서 객체로 문서화
    additionalProperties: {
      type: 'array',
      items: { type: 'string' },
      example: ["Required"]
    },
  })
  errors?: Record<string, string[] | undefined>;
}