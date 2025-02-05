import { Module } from '@nestjs/common';
import { CollectDbService } from './collect-db.service';
import { CollectDbController } from './collect-db.controller';

@Module({
  controllers: [CollectDbController],
  providers: [CollectDbService],
})
export class CollectDbModule {}
