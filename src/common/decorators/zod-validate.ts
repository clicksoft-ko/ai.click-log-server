import { UsePipes, applyDecorators } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Serialize } from './serialize';


export function ZodValidate(schema: ZodSchema): MethodDecorator;
export function ZodValidate(schema: ZodSchema, dto: new (...args: any[]) => {}): MethodDecorator;
export function ZodValidate(schema: ZodSchema, dto?: new (...args: any[]) => {}) {
  const decorators = [UsePipes(new ZodValidationPipe(schema))];
  
  if (dto) {
    decorators.push(Serialize(dto));
  }

  return applyDecorators(...decorators);
}