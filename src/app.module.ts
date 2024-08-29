import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickModule } from './api/click/click.module';
import { globalFilterProviders } from './common/filters/global-filter-providers';
import { PrismaModule } from './database/prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { SurveyModule } from './api/survey/survey.module';

@Module({
  imports: [ConfigModule, ClickModule, PrismaModule, SurveyModule],
  controllers: [AppController],
  providers: [...globalFilterProviders, AppService, Logger],
})
export class AppModule { }
