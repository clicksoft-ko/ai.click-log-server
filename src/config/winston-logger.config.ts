import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as path from 'path';
import * as winston from 'winston';

const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = path.join(__dirname, '..', 'logs');

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonTransports = [
  new winston.transports.Console({
    level: isProduction ? 'info' : 'silly',
    format: isProduction
      ? winston.format.simple()
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike('click-server', {
            colors: true,
            prettyPrint: true,
          }),
        ),
  }),
  new winstonDaily(dailyOptions('info')),
  new winstonDaily(dailyOptions('warn')),
  new winstonDaily(dailyOptions('error')),
];
