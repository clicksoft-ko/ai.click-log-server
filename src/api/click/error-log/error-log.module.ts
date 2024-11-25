import { Module } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';
import { ErrorLogController } from './error-log.controller';
import { Logger } from '@nestjs/common';

@Module({
  controllers: [ErrorLogController],
  providers: [ErrorLogService, Logger],
})
export class ErrorLogModule {}
