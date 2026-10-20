import { ZodValidate } from '@/common/decorators/zod-validate';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { getIp } from '@/shared/utils/ip.util';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { streamJsonArray } from '@/shared/utils/stream-json.util';
import { DateRangeDto, DateRangeSchema } from '../dto/date-range.dto';
import { ErrorLogStacktraceDto } from './dto/error-log-stacktrace.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { ErrorLogService } from './error-log.service';

@Controller('click/error-log')
export class ErrorLogController {
  private readonly logger = new Logger(ErrorLogController.name);

  constructor(private readonly errorLogService: ErrorLogService) {}

  @Post()
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.errorLogService.saveErrorLog(dto, ip);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getErrorLogs(
    @Query(new ZodValidationPipe(DateRangeSchema)) query: DateRangeDto,
    @Res() res: Response,
  ) {
    await streamJsonArray(
      res,
      this.errorLogService.getErrorLogBatches(query),
      (error) =>
        this.logger.warn(`에러 로그 응답 스트리밍 중단: ${error.message}`),
    );
  }

  @ApiResponse({
    description: 'The stacktrace has been successfully retrieved.',
    type: ErrorLogStacktraceDto,
  })
  @UseGuards(AuthGuard)
  @Get('/:id/stacktrace')
  getStacktrace(@Param('id') id: string) {
    return this.errorLogService.getStacktrace(parseInt(id));
  }
}
