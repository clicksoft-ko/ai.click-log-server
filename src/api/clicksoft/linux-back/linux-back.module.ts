import { Module } from '@nestjs/common';
import { LinuxBackController } from './linux-back.controller';
import { LinuxBackService } from './linux-back.service';

@Module({
  controllers: [LinuxBackController],
  providers: [LinuxBackService],
})
export class LinuxBackModule {}
