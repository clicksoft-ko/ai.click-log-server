import { ApiProperty } from '@nestjs/swagger';

export class SlowQueryDto {
  @ApiProperty({ description: '요양기관기호', example: '12345678' })
  ykiho: string;

  @ApiProperty({ description: '컴퓨터 이름', example: 'PC-001' })
  computerName: string;

  @ApiProperty({ description: '어셈블리명', example: 'MyAssembly' })
  assemblyName: string;

  @ApiProperty({ description: '클래스명', example: 'MyClass' })
  className: string;

  @ApiProperty({ description: '메소드명', example: 'MyMethod' })
  methodName: string;

  @ApiProperty({
    description: '쿼리 문자열',
    example: 'SELECT * FROM users WHERE id = 1',
  })
  queryString: string;

  @ApiProperty({ description: '실행 시간 (초)', example: 5.2 })
  executionSeconds: number;

  @ApiProperty({ description: '생성 일시', example: '2023-01-01T00:00:00Z' })
  createdAt: Date;
}
