import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SaveSettingRecordSchema,
  SettingRecordDto,
} from './dto/setting-record.dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ykihoSchema } from '../validators/common.validator';
import { SettingRecordService } from './setting-record.service';

@ApiTags('(new,e)Click API')
@Controller('setting-record')
export class SettingRecordController {
  constructor(private readonly service: SettingRecordService) {}

  @Post('/:ykiho')
  async saveSettingRecord(
    @Param('ykiho', new ZodValidationPipe(ykihoSchema)) ykiho: string,
    @Body(new ZodValidationPipe(SaveSettingRecordSchema)) dto: SettingRecordDto,
  ) {
    return await this.service.saveSettingRecord({
      ykiho,
      dto,
    });
  }

  @Get('/:ykiho')
  getSettingRecord(
    @Param('ykiho', new ZodValidationPipe(ykihoSchema)) ykiho: string,
  ) {
    return { ykiho };
  }
}
