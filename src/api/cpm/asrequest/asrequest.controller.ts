import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidate } from '@/common/decorators/zod-validate';
import { HeaderGuard } from '@/common/guards/header.guard';
import { apiHeader } from '@/constants/api-header';
import { ApplyAsRequestDto, ApplyAsSchema } from './dto/apply-asrequest.dto';
import { ApplyAsRequestResponseDto } from './dto/apply-asrequest-response.dto';
import { AsrequestService } from './asrequest.service';
import { ErrorResponseDto } from '@/shared/dto/error-response.dto';

@ApiTags('Click API - 부가서비스')
// @ApiHeader({
//   name: apiHeader.click.key,
//   description: 'API를 사용하기 위해서 반드시 필요한 정보',
//   required: true,
// })
// @UseGuards(HeaderGuard)
@Controller('cpm/asrequest')
export class AsrequestController {
  constructor(private readonly asService: AsrequestService) {}

  @ApiOperation({
    summary: '부가서비스 신청',
    description:
      '부가서비스 신청을 위한 API입니다. 모든 필드는 필수 입력값입니다.',
  })
  @ApiResponse({
    status: 201,
    description: '부가서비스 신청이 성공적으로 완료되었습니다.',
    type: ApplyAsRequestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
    type: ErrorResponseDto,
  })
  @Post()
  @ZodValidate(ApplyAsSchema)
  async applyAdditionalService(
    @Body() dto: ApplyAsRequestDto,
  ): Promise<ApplyAsRequestResponseDto> {
    return this.asService.applyAdditionalService(dto);
  }
}
