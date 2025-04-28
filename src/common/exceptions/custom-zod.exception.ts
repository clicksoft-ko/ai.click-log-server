import { ArgumentMetadata, Paramtype } from '@nestjs/common';
import { ZodError, ZodIssue } from 'zod';

export class CustomZodException extends ZodError {
  constructor(
    issues: ZodIssue[],
    public metadata?: ArgumentMetadata,
  ) {
    super(issues);
  }
}
