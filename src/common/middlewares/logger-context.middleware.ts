import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as dayjs from 'dayjs'
@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
  ) { }

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = req.get('user-agent');
    const startDt = Date.now();
    
    res.on('finish', () => {
      const { statusCode } = res;
      const formattedDate = dayjs(startDt).format('YYYY-MM-DD HH:mm:ss');
      const processingTime = Date.now() - startDt;
      this.logger.log(
        `${formattedDate} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent} ${processingTime}ms`,
      );
    });

    next();
  }
}