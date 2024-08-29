import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { APP_GUARD } from '@nestjs/core';
import { SurveyHeaderGuard } from './guards/survey-header.guard';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule { }
