import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ErrorResponseDto } from '@/shared/dto/error-response.dto';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSurveyDto, createSurveySchema } from './dto/create-survey.dto';
import { CustomerSurveyDto } from './dto/customer-survey.dto';
import { GetSurveyResponseDto } from './dto/get-survey-response.dto';
import { RejectSurveyDto, rejectSurveySchema } from './dto/reject-survey.dto';
import { SurveyHeaderGuard } from './guards/survey-header.guard';
import { SurveyService } from './survey.service';
import { GetSurveyParamsDto, getSurveyParamsSchema } from './dto/get-survey-params.dto';
import { koDayjs, usDayjs } from '@/shared/utils/date.util';
import * as dayjs from 'dayjs';

@ApiTags("Survey (만족도 설문조사)")
@ApiHeader({
  name: 'X-Survey-Header',
  description: 'API를 사용하기 위해서 반드시 필요한 정보',
  required: true,  // 헤더가 필수임을 명시
})
@Controller('survey')
@UseGuards(SurveyHeaderGuard)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @ApiResponse({
    status: 200,
    description: '설문조사 기간이고 설문조사를 작성하지 않은 경우',
    type: GetSurveyResponseDto,
  })
  @ApiBadRequestResponse({
    description: '설문조사 기간이 아니거나 설문조사를 이미 작성한 경우',
    type: ErrorResponseDto,
  })
  @Get("/")
  async getSurvey(
    @Query(new ZodValidationPipe(getSurveyParamsSchema)) query: GetSurveyParamsDto) {

    return this.surveyService.getSurvey(query);
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
