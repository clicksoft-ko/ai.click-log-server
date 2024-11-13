import { z } from 'zod';

export const AuthCheckSchema = z.object({
  accessToken: z.string().min(1),
});

export class AuthCheckDto {
  accessToken: string;
}
