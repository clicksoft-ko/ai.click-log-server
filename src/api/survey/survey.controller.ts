import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto, createSurveySchema } from './dto/create-survey.dto';
import { ZodValidate } from '@/common/decorators/zod-validate';
import { RejectSurveyDto, rejectSurveySchema } from './dto/reject-survey.dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ExistsSurveyParamsDto, existsSurveyParamsSchema } from './dto/exists-survey-params.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiHeaders, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ExistsSurveyResponseDto } from './dto/exists-survey-response.dto';
import { ErrorResponseDto } from '@/shared/dto/error-response.dto';
import { CustomerSurveyDto } from './dto/customer-survey.dto';
import { SurveyHeaderGuard } from './guards/survey-header.guard';

@ApiTags("Survey (만족도 설문조사)")
@ApiHeader({
  name: 'X-Click-Header',
  description: 'A custom header required for this endpoint',
  required: true,  // 헤더가 필수임을 명시
})
@Controller('survey')
@UseGuards(SurveyHeaderGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @ApiResponse({
    status: 200,
    description: '설문조사 작성했을 시',
    type: ExistsSurveyResponseDto,
    example: {
      exists: true,
    }
  })
  @ApiBadRequestResponse({
    description: '잘못된 응답',
    type: ErrorResponseDto,
  })
  @Get("/exists")
  async exists(
    @Query(new ZodValidationPipe(existsSurveyParamsSchema)) query: ExistsSurveyParamsDto) {

    return this.surveyService.exists(query);
  }

  @ApiCreatedResponse({ description: "저장 성공", type: CustomerSurveyDto })
  @ApiBadRequestResponse({ description: '잘못된 응답', type: ErrorResponseDto })
  @Post("/")
  @ZodValidate(createSurveySchema)
  async create(@Body() dto: CreateSurveyDto) {
    return this.surveyService.create(dto);
  }

  @ApiCreatedResponse({ description: "저장 성공", type: CustomerSurveyDto })
  @ApiBadRequestResponse({ description: '잘못된 응답', type: ErrorResponseDto })
  @Post("/reject")
  @ZodValidate(rejectSurveySchema)
  async reject(@Body() dto: RejectSurveyDto) {
    return this.surveyService.reject(dto);
  }
}
