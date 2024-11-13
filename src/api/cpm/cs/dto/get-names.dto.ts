import { ApiProperty } from "@nestjs/swagger";

export class GetNamesDataDto {
  @ApiProperty({
    description: '요양기관기호',
    example: '10170068',
  })
  code: string;

  @ApiProperty({
    description: '기관명칭',
    example: '클릭요양병원',
  })
  myung: string;
}

export class GetNamesDto {
  @ApiProperty({
    description: '총 개수',
    example: 10,
  })
  totalCount: number;

  @ApiProperty({
    description: '데이터',
    type: [GetNamesDataDto],
  })
  data: GetNamesDataDto[];
}
