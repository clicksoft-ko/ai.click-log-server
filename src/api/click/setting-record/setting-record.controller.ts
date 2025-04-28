import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '특정 요양기관기호에 대한 설정 기록 저장' })
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
  @ApiOperation({ summary: '요양기관기호로 설정 기록 조회' })
  @ApiResponse({
    status: 200,
    description: '요양기관기호로 설정 기록 조회',
    type: SettingRecordDto,
  })
  async getSettingRecord(
    @Param('ykiho', new ZodValidationPipe(ykihoSchema)) ykiho: string,
  ) {
    return await this.service.getSettingRecord(ykiho);
  }

  @ApiOperation({ summary: '모든 설정 기록 조회' })
  @ApiResponse({
    status: 200,
    description: '모든 설정 기록 조회',
    type: [SettingRecordDto],
  })
  @Get('/')
  async getAllSettingRecords() {
    return await this.service.getAllSettingRecords();
  }
}
