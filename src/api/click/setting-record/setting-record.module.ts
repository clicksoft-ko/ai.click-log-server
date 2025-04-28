import { Module } from '@nestjs/common';
import { SettingRecordController } from './setting-record.controller';
import { SettingRecordService } from './setting-record.service';

@Module({
  controllers: [SettingRecordController],
  providers: [SettingRecordService]
})
export class SettingsModule {}
