import { Module } from '@nestjs/common';
import { EmService } from './em.service';

@Module({
  providers: [EmService],
  exports: [EmService], // Exporting EmService to be used in other modules
})
export class EmModule {}
