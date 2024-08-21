import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: Request) {
    const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
    const xForwardedFor = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'];
    const clientIp =
      xOriginForwardedFor?.split(":")[0] ||
      xForwardedFor?.split(',')[0].trim();

    return { xOriginForwardedFor, clientIp, realIp, xForwardedFor, headers: req.headers }
  }
}
