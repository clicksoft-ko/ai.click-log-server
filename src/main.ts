import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './config/winston-logger.config';
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import './shared/plugins';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);
  app.setGlobalPrefix("/api");
  app.enableCors();
  app.useLogger(winstonLogger);

  const config = new DocumentBuilder()
    .setTitle('Click Log API')
    .setDescription('클릭소프트 로그 API 입니다.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.NODE_ENV === 'production' ? 3000 : 8080;
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
