import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateSkLikeDataSchema = z.object({
  ycode: z.string(),
  skcode: z.string(),
  like: z.boolean()
});

export const CreateSkLikeCountDtoSchema = z.object({
  datas: z.array(CreateSkLikeDataSchema)
});

export class CreateSkLikeData {
  @ApiProperty({ description: '전산 코드' })
  ycode: string;

  @ApiProperty({ description: '상병 코드' })
  skcode: string;

  @ApiProperty({ description: '좋아요 여부' })
  like: boolean;
}

export class CreateSkLikeCountDto {
  @ApiProperty({ type: [CreateSkLikeData], description: '좋아요 데이터 배열' })
  datas: CreateSkLikeData[];
}