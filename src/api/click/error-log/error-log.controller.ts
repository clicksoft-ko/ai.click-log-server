import { ZodValidate } from '@/common/decorators/zod-validate';
import { AuthGuard } from '@/common/guards/auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { getIp } from '@/shared/utils/ip.util';
import { Body, Controller, Get, Inject, Logger, LoggerService, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ErrorLogStacktraceDto } from './dto/error-log-stacktrace.dto';
import { GetErrorLogQueryDto, GetErrorLogSchema } from './dto/get-error-log.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { ErrorLogService } from './error-log.service';
import { Readable } from 'stream';

@Controller('click/error-log')
export class ErrorLogController {
  constructor(
    private readonly errorLogService: ErrorLogService,
    @Inject(Logger) private readonly logger: LoggerService) { }

  @Post()
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.errorLogService.saveErrorLog(dto, ip);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ZodValidate(GetErrorLogSchema)
  getErrorLogs(@Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto) {
    return this.errorLogService.getErrorLogs(query);
  }

  @Get('/test')
  @ZodValidate(GetErrorLogSchema)
  async getTestErrorLogs(@Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto,
    @Res() res: Response) {
    const errorLogs = await this.errorLogService.getErrorLogs(query);

    res.set({
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    });

    const stream = new Readable({
      objectMode: true,
      read() {
        // 한 번에 모든 데이터를 스트림으로 전송
        this.push('[');
        errorLogs.forEach((log, index) => {
          this.push(`${index > 0 ? ',' : ''}${JSON.stringify(log)}`);
        });
        this.push(']');
        this.push(null);
      }
    });

    stream.pipe(res);
  }

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
