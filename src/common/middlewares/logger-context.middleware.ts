import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as dayjs from 'dayjs';
import { getIp } from '@/shared/utils/ip.util';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent');
    const startDt = Date.now();
    const ip = getIp(req);

    res.on('finish', () => {
      const { statusCode } = res;
      const formattedDate = dayjs(startDt).format('YYYY-MM-DD HH:mm:ss');
      const processingTime = Date.now() - startDt;
      this.logger.log(
        'log',
        `${formattedDate} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent} ${processingTime}ms`,
      );
    });

    next();
  }
}
