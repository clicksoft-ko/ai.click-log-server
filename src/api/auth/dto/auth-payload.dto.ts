import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({
    description: 'Is authenticated',
    example: true
  })
  isAuthenticated: boolean;
}
