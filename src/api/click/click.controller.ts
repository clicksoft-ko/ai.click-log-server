import { ZodValidate } from '@/common/decorators/zod-validate';
import { getIp } from '@/shared/utils/ip.util';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ClickService } from './click.service';
import { ErrorLogDto } from './dto/error-log.dto';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';

@ApiTags("Click")
@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ErrorLogDto,
  })
  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.clickService.saveErrorLog(dto, ip);
  }
}
