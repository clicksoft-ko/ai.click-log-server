import { Module } from '@nestjs/common';
import { SmsService as SmsService } from './sms.service';
import { smsDbProviders } from '@/common/providers/sms-db.providers';

@Module({
  providers: [SmsService, ...smsDbProviders],
  exports: [SmsService, ...smsDbProviders],
})
export class SmsModule {}
