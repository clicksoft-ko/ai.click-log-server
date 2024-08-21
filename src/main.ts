import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './config/winston-logger.config';
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 3);
  app.setGlobalPrefix("/api");

  app.useLogger(winstonLogger);

  await app.listen(3000);
}
bootstrap();
