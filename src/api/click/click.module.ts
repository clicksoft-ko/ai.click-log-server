import { Module } from '@nestjs/common';
import { ClickService } from './click.service';
import { ClickController } from './click.controller';
import { ErrorLogModule } from './error-log/error-log.module';
import { SlowQueryModule } from './slow-query/slow-query.module';

@Module({
  controllers: [ClickController],
  providers: [ClickService],
  imports: [ErrorLogModule, SlowQueryModule],
})
export class ClickModule {}
