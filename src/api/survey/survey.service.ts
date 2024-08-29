import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { RejectSurveyDto } from './dto/reject-survey.dto';
import { dbNow } from '@/shared/utils/date.util';
import { ExistsSurveyParamsDto } from './dto/exists-survey-params.dto';

@Injectable()
export class SurveyService {
  constructor(private prisma: CpmPrismaService) { }

  async exists(query: ExistsSurveyParamsDto) {
    const count = await this.prisma.customerSurvey.count({
      where: { ver: query.ver, ykiho: query.ykiho, userId: query.userId }
    })

    return { exists: count > 0 }
  }

  async validateCreate(dto: ExistsSurveyParamsDto) {
    const isExists = await this.exists({ ...dto });
    if (isExists) throw new BadRequestException("이미 설문조사를 했습니다.");
  }

  async create(dto: CreateSurveyDto) {
    await this.validateCreate({ ...dto });

    return this.prisma.customerSurvey.create({
      data: {
        ...dto,
        reject: false,
        surveyDate: dbNow(),
      }
    })
  }

  async reject(dto: RejectSurveyDto) {
    await this.validateCreate({ ...dto });

    return this.prisma.customerSurvey.create({
      data: {
        ...dto,
        reject: true,
        surveyDate: dbNow(),
      }
    })
  }
}
