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
  async getErrorLogs(@Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto,
    @Res() res: Response) {
    const errorLogs = await this.errorLogService.getErrorLogs(query);

    const stream = new Readable({
      objectMode: true,
      read(this: Readable & { started: boolean; index: number }) {
        if (!this.started) {
          this.push('[');
          this.started = true;
          this.index = 0;
          return;
        }

        if (this.index < errorLogs.length) {
          const prefix = this.index > 0 ? ',' : ''; // 첫 항목이 아니면 쉼표 추가
          this.push(prefix + JSON.stringify(errorLogs[this.index]));
          this.index++;
        } else if (this.index === errorLogs.length) {
          this.push(']'); // 배열 종료
          this.push(null);
          this.index++;
        }
      },
    });

    res.set({
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    });

    stream.pipe(res);
  }

  @Get('/test')
  @ZodValidate(GetErrorLogSchema)
  async getTestErrorLogs(
    @Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto,
    @Res() res: Response) {
    const errorLogs = await this.errorLogService.getErrorLogs(query);

    const stream = new Readable({
      objectMode: true,
      read(this: Readable & { started: boolean; index: number }) {
        if (!this.started) {
          this.push('[');
          this.started = true;
          this.index = 0;
          return;
        }

        if (this.index < errorLogs.length) {
          const prefix = this.index > 0 ? ',' : ''; // 첫 항목이 아니면 쉼표 추가
          this.push(prefix + JSON.stringify(errorLogs[this.index]));
          this.index++;
        } else if (this.index === errorLogs.length) {
          this.push(']'); // 배열 종료
          this.push(null);
          this.index++;
        }
      },
    });

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
  @Get("/:id/stacktrace")
  getStacktrace(@Param("id") id: string) {
    return this.errorLogService.getStacktrace(parseInt(id));
  }
}
