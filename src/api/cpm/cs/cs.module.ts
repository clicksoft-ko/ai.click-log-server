import { Module } from '@nestjs/common';
import { CsService } from './cs.service';
import { CsController } from './cs.controller';

@Module({
  controllers: [CsController],
  providers: [CsService],
})
export class CsModule {}
