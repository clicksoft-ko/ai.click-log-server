import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor, SerializeInterceptor } from '../interceptors/serialize.interceptor';


export function Serialize<T extends ClassConstructor>(dto: T) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
