import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { ClickModule } from './api/click/click.module';
import { CsModule } from './api/cpm/cs/cs.module';
import { SurveyModule } from './api/survey/survey.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { globalFilterProviders } from './common/providers/global-filter.providers';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { CollectDbModule } from './api/collect-db/v1/collect-db.module';
import { AsrequestModule } from './api/cpm/asrequest/asrequest.module';
import { EmModule } from './api/cpm/em/em.module';
import { MmsModule } from './modules/mms/mms.module';

@Module({
  imports: [
    ConfigModule,
    ClickModule,
    PrismaModule,
    SurveyModule,
    MonitoringModule,
    CsModule,
    AuthModule,
    CollectDbModule,
    AsrequestModule,
    EmModule,
    MmsModule,
  ],
  controllers: [AppController],
  providers: [...globalFilterProviders, AppService, Logger],
})
export class AppModule {}
