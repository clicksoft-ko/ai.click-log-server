import { ApiProperty } from '@nestjs/swagger';

export class StackframeDto {
  @ApiProperty({ description: 'ID' })
  id: number;
  
  @ApiProperty({ description: '어셈블리명' })
  assemblyName: string;

  @ApiProperty({ description: '클래스명' })
  className: string;

  @ApiProperty({ description: '메소드명' })
  methodName: string;

  @ApiProperty({ description: '오프셋' })
  offset: number;

  @ApiProperty({ description: 'IL 오프셋' })
  ilOffset: number;

  @ApiProperty({ description: '열 번호' })
  columnNumber: number;

  @ApiProperty({ description: '행 번호' })
  lineNumber: number;

  @ApiProperty({ description: '파일명' })
  fileName: string;
}
