import { Module } from '@nestjs/common';
import { ErrorLogModule } from './error-log/error-log.module';
import { SlowQueryModule } from './slow-query/slow-query.module';
import { SettingsModule } from './setting-record/setting-record.module';

@Module({
  imports: [ErrorLogModule, SlowQueryModule, SettingsModule],
})
export class ClickModule {}
