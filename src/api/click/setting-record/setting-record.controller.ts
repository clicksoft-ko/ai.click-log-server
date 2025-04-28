import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  SaveSettingRecordSchema,
  SettingRecordDto,
} from './dto/setting-record.dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ykihoSchema } from '../validators/common.validator';
import { SettingRecordService } from './setting-record.service';
import { apiHeader } from '@/constants/api-header';
import { HeaderGuard } from '@/common/guards/header.guard';

@ApiTags('(new,e)Click API')
@ApiHeader({
  name: apiHeader.click.key,
  description: 'API를 사용하기 위해서 반드시 필요한 정보',
  required: true,
})
@UseGuards(HeaderGuard)
@Controller('click/setting-record')
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
  async getSettingRecord(
    @Param('ykiho', new ZodValidationPipe(ykihoSchema)) ykiho: string,
  ) {
    return await this.service.getSettingRecord(ykiho);
  }
}
