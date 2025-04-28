import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { CustomZodException } from '../exceptions/custom-zod.exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const validationResult = this.schema.safeParse(value);
    if (validationResult.success) {
      return validationResult.data;
    }

    throw new CustomZodException(validationResult.error.issues, metadata);
  }
}
