import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: Request) {
    const xForwardedFor = req.headers['x-forwarded-for'] as string;
    const clientIp =
      xForwardedFor?.split(',')[0].trim();
    const realIp = req.headers['x-real-ip'];
    return { clientIp, realIp }
  }
}
