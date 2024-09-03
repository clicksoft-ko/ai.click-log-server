import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { RejectSurveyDto } from './dto/reject-survey.dto';
import { dbNow, koDayjs } from '@/shared/utils/date.util';
import { GetSurveyParamsDto } from './dto/get-survey-params.dto';

@Injectable()
export class SurveyService {

  constructor(private prisma: CpmPrismaService) { }

  async getSurvey(query: GetSurveyParamsDto) {
    const ymd = koDayjs().format("YYYYMMDD");
    const surveyPeriod = await this.prisma.surveyPeriod.findFirst({
      where: {
        symd: { lte: ymd },
        eymd: { gte: ymd },
      }
    });

    if (!surveyPeriod) {
      throw new BadRequestException("설문조사 기간이 아닙니다.")
    }

    await this.#validateCreate({ ver: surveyPeriod.ver, userId: query.userId, ykiho: query.ykiho });

    return surveyPeriod;
  }

  async #validateCreate(args: ExistsSurveyArgs) {
    const count = await this.prisma.customerSurvey.count({
      where: { ...args }
    })
    if (count > 0) throw new BadRequestException("이미 설문조사를 했습니다.");
  }

  async create(dto: CreateSurveyDto) {
    await this.#validateCreate({ ...dto });

    return this.prisma.customerSurvey.create({
      data: {
        ...dto,
        reject: false,
        surveyDate: dbNow(),
      }
    })
  }

  async reject(dto: RejectSurveyDto) {
    await this.#validateCreate({ ...dto });

    return this.prisma.customerSurvey.create({
      data: {
        ...dto,
        reject: true,
        surveyDate: dbNow(),
      }
    })
  }
}

