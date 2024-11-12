import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { YkihoSchema } from '@/shared/dto/ykiho.schema';
import { getIp } from '@/shared/utils/ip.util';
import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ClickService } from './click.service';
import { ErrorLogDto } from './dto/error-log.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { SaveSettingRecordSchema, SaveSettingRequestDto, SaveSettingResponseDto, SettingRecordDto } from './dto/setting-record.dto';
import { ClickHeaderGuard } from './guards/click-header.guard';
import { GetErrorLogSchema, GetErrorLogQueryDto } from './dto/get-error-log.dto';

@ApiTags("(new,e)Click API")
@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ErrorLogDto,
  })

  @Get("/error-log")
  @ZodValidate(GetErrorLogSchema)
  getErrorLog(@Query(new ZodValidationPipe(GetErrorLogSchema)) query: GetErrorLogQueryDto) {
    return this.clickService.getErrorLog(query);
  }

  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.clickService.saveErrorLog(dto, ip);
  }

  @ApiHeader({
    name: 'X-Click-Header',
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,  // 헤더가 필수임을 명시
  })
  @ApiResponse({
    description: 'The setting record has been successfully created or updated.',
    type: SaveSettingResponseDto,
  })
  @UseGuards(ClickHeaderGuard)
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

