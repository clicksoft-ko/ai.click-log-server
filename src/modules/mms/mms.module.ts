import { Module } from '@nestjs/common';
import { MmsService } from './mms.service';
import { smsDbProviders } from '@/common/providers/sms-db.providers';

@Module({
  providers: [MmsService, ...smsDbProviders],
  exports: [MmsService, ...smsDbProviders],
})
export class MmsModule {}
