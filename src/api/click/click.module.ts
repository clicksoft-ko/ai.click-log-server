import { Module } from '@nestjs/common';
import { ClickService } from './click.service';
import { ClickController } from './click.controller';
import { ErrorLogModule } from './error-log/error-log.module';

@Module({
  controllers: [ClickController],
  providers: [ClickService],
  imports: [ErrorLogModule],
})
export class ClickModule {}
