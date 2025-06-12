import { ApiProperty } from '@nestjs/swagger';

export class ApplyAsRequestResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;
}
