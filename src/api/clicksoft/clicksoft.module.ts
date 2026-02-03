import { Module } from '@nestjs/common';
import { LinuxBackModule } from './linux-back/linux-back.module';

@Module({
  imports: [LinuxBackModule],
})
export class ClickSoftModule {}
