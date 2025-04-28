import { z } from 'zod';

export const ykihoSchema = z
  .string()
  .length(8, '요양기관기호는 8자리여야 합니다')
  .regex(/^[0-9]+$/, '요양기관기호는 숫자만 포함해야 합니다');
