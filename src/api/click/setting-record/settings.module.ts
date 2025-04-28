import { Module } from '@nestjs/common';
import { SettingRecordController } from './settings.controller';
import { SettingRecordService } from './setting-record.service';

@Module({
  controllers: [SettingRecordController],
  providers: [SettingRecordService]
})
export class SettingsModule {}
