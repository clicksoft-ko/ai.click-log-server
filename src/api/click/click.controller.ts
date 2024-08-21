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
    let ip = xOriginForwardedFor?.split(":")[0];
    if (!ip) return ip;
    const xForwardedFor = req.headers['x-forwarded-for'] as string;
    ip = xForwardedFor?.split(',')[0].trim();
    if (!ip) return ip;
    ip = req.headers['x-real-ip'] as string;
    if (!ip) return ip;
    return req.ip as string;
  }
  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Req() req: Request) {
    const ip = this.getIp(req);
    return this.clickService.saveErrorLog(dto, ip);
  }
}
