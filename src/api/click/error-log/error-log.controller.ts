import { ZodValidate } from '@/common/decorators/zod-validate';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { getIp } from '@/shared/utils/ip.util';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ErrorLog } from 'prisma/generated/click-schema-client';
import { Readable } from 'stream';
import { DateRangeDto, DateRangeSchema } from '../dto/date-range.dto';
import { ErrorLogStacktraceDto } from './dto/error-log-stacktrace.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { ErrorLogService } from './error-log.service';

@Controller('click/error-log')
export class ErrorLogController {
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
    const errorLogs = await this.errorLogService.getErrorLogs(query);

    // 스트림 생성을 위한 유틸리티 함수
    function* generateJson(data: Partial<ErrorLog>[]) {
      yield '[';
      for (let i = 0; i < data.length; i++) {
        yield i === 0 ? JSON.stringify(data[i]) : ',' + JSON.stringify(data[i]);
      }
      yield ']';
    }

    const stream = Readable.from(generateJson(errorLogs), { encoding: 'utf8' });

    res.set({
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    });

    stream.pipe(res);
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
