import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const SigninSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(1),
});

export class SigninDto {
  @ApiProperty({
    description: 'User ID',
    example: 'adminid'
  })
  userId: string;

  @ApiProperty({
    description: 'Password',
    example: 'adminpw'
  })
  password: string;
}