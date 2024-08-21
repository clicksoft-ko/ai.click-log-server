import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Ip, Post, Req, Res } from '@nestjs/common';
import { ClickService } from './click.service';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { Request } from 'express';
import { getIp } from '@/shared/utils/ip.util';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = getIp(req);
    return this.clickService.saveErrorLog(dto, ip);
  }
}
