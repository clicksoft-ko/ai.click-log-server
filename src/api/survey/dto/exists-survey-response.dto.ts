import { ApiProperty } from "@nestjs/swagger";

export class ExistsSurveyResponseDto {
  @ApiProperty()
  exists: boolean;
}