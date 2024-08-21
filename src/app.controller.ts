import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Req() req: Request) {
    const xOriginForwardedFor = req.headers['x-original-forwarded-for'] as string;
    const xForwardedFor = req.headers['x-original-forwarded-for'] as string;
    const clientIp =
      xForwardedFor?.split(',')[0].trim();
    const realIp = req.headers['x-real-ip'];
    
    return { xOriginForwardedFor, clientIp, realIp, xForwardedFor, headers: req.headers }
  }
}
