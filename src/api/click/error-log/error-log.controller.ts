import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { apiHeader } from '@/constants/api-header';
import { getIp } from '@/shared/utils/ip.util';
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorLogStacktraceDto } from './dto/error-log-stacktrace.dto';
import { GetErrorLogQueryDto, GetErrorLogSchema } from './dto/get-error-log.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { ErrorLogService } from './error-log.service';
import { AuthGuard } from '@/common/guards/auth.guard';

@Controller('click/error-log')
export class ErrorLogController {
  constructor(private readonly errorLogService: ErrorLogService) { }

  @Post()
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.errorLogService.saveErrorLog(dto, ip);
  }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,
  })
  @UseGuards(AuthGuard)
  @Get()
  @ZodValidate(GetErrorLogSchema)
  getErrorLogs(@Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto) {
    return this.errorLogService.getErrorLogs(query);
  }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,  // 헤더가 필수임을 명시
  })
  @ApiResponse({
    description: 'The stacktrace has been successfully retrieved.',
    type: ErrorLogStacktraceDto,
  })
  @UseGuards(AuthGuard)
  @Get("/:id/stacktrace")
  getStacktrace(@Param("id") id: string) {
    return this.errorLogService.getStacktrace(parseInt(id));
  }
}
