import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Ip, Post, Req, Res } from '@nestjs/common';
import { ClickService } from './click.service';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { Request } from 'express';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  private getIp(req: Request): string | undefined {
    const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
    if (xOriginForwardedFor) {
      return xOriginForwardedFor.split(":")[0];
    }

    const xForwardedFor = req.headers['x-forwarded-for'] as string;
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim()
    }

    const realIp = req.headers['x-real-ip'] as string;
    if (realIp) {
      return realIp;
    }

    return req.ip as string;
  }

  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = this.getIp(req);
    return this.clickService.saveErrorLog(dto, ip);
  }
}
