import { Module } from '@nestjs/common';
import { AsrequestController } from './asrequest.controller';
import { AsrequestService } from './asrequest.service';
import { CsService } from '../cs/cs.service';
import { EmService } from '../em/em.service';
import { MmsModule } from '@/modules/mms/mms.module';

@Module({
  imports: [MmsModule],
  controllers: [AsrequestController],
  providers: [AsrequestService, CsService, EmService],
})
export class AsrequestModule {}
