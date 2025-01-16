import { Module } from '@nestjs/common';
import { SlowQueryController } from './slow-query.controller';
import { SlowQueryService } from './slow-query.service';

@Module({
  controllers: [SlowQueryController],
  providers: [SlowQueryService]
})
export class SlowQueryModule {}
