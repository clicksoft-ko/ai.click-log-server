import { Module } from '@nestjs/common';
import { CsService } from './cs.service';
import { CsController } from './cs.controller';

@Module({
  controllers: [CsController],
  providers: [CsService],
  exports: [CsService], // Exporting CsService to be used in other modules
})
export class CsModule {}
