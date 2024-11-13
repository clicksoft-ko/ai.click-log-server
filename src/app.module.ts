import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickModule } from './api/click/click.module';
import { globalFilterProviders } from './common/filters/global-filter-providers';
import { PrismaModule } from './database/prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { SurveyModule } from './api/survey/survey.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { CsModule } from './api/cpm/cs/cs.module';
import { AuthModule } from './api/auth/auth.module';
import { EnvModule } from './modules/env/env.module';

@Module({
  imports: [ConfigModule, ClickModule, PrismaModule, SurveyModule, MonitoringModule, CsModule, AuthModule, EnvModule],
  controllers: [AppController],
  providers: [...globalFilterProviders, AppService, Logger],
})
export class AppModule { }
