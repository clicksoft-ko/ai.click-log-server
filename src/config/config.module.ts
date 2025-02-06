import { LoggerContextMiddleware } from '@/common/middlewares/logger-context.middleware';
import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './jwt.config';
import { EnvModule } from '@/modules/env/env.module';
import { WinstonLogger, WinstonModule } from 'nest-winston';
import { winstonTransports } from './winston-logger.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({ transports: winstonTransports }),
    JwtModule.registerAsync({ useClass: JwtConfig, global: true }),
    EnvModule,
  ],
  providers: [Logger, WinstonLogger],
})
export class ConfigModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
