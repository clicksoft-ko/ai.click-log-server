import { HeaderGuard } from '@/common/guards/header.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { apiHeader } from '@/constants/api-header';
import { YkihoSchema } from '@/shared/dto/ykiho.schema';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClickService } from './click.service';
import { ErrorLogDto } from './error-log/dto/error-log.dto';
import { SaveSettingRecordSchema, SaveSettingRequestDto, SaveSettingResponseDto, SettingRecordDto } from './dto/setting-record.dto';

@ApiTags("(new,e)Click API")
@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: [ErrorLogDto],
  })

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,  
  })
  @ApiResponse({
    description: 'The setting record has been successfully created or updated.',
    type: SaveSettingResponseDto,
  })
  @UseGuards(HeaderGuard)
  @Put("/setting-record/:ykiho")
  saveSettingRecord(
    @Param("ykiho", new ZodValidationPipe(YkihoSchema)) ykiho: string,
    @Body(new ZodValidationPipe(SaveSettingRecordSchema)) dto: SaveSettingRequestDto
  ) {
    return this.clickService.saveSettingRecord({ ykiho, useSilsonbohum: dto.useSilsonbohum });
  }

  @ApiCreatedResponse({
    description: 'The setting record has been successfully retrieved.',
    type: SettingRecordDto,
  })
  @Get("/setting-record/:ykiho")
  getSettingRecord(@Param("ykiho", new ZodValidationPipe(YkihoSchema)) ykiho: string) {
    return this.clickService.getSettingRecord(ykiho);
  }
}

