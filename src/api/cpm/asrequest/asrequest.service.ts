import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { koDayjs } from '@/shared/utils/date.util';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CsService } from '../cs/cs.service';
import { EmService } from '../em/em.service';
import { ApplyAsRequestResponseDto } from './dto/apply-asrequest-response.dto';
import { ApplyAsRequestDto } from './dto/apply-asrequest.dto';
import { SmsService } from '@/modules/sms/sms.service';
import { Prisma, PrismaClient } from 'prisma/generated/cpm-schema-client/wasm';
import { DefaultArgs } from 'prisma/generated/cpm-schema-client/runtime/library';
import { CpmTransactionPrismaClient } from '@/common/types';

@Injectable()
export class AsrequestService {
  constructor(
    private readonly prisma: CpmPrismaService,
    private readonly csService: CsService,
    private readonly emService: EmService,
    private readonly smsService: SmsService,
  ) {}

  private async upsertPinfo(
    tx: CpmTransactionPrismaClient,
    dto: ApplyAsRequestDto,
    type: string,
    ymd: string,
  ) {
    await tx.pinfo.upsert({
      where: { phone_type: { phone: dto.hosdamdangtel, type } },
      create: {
        phone: dto.hosdamdangtel,
        type,
        name: dto.hosdamdang,
        email: dto.email || '',
        indate: ymd,
        yoyangkiho: dto.yoyangno,
      },
      update: {
        name: dto.hosdamdang,
        email: dto.email || '',
        yoyangkiho: dto.yoyangno,
        indate: ymd,
      },
    });
  }

  async applyAdditionalService(
    dto: ApplyAsRequestDto,
  ): Promise<ApplyAsRequestResponseDto> {
    const ymd = koDayjs().format('YYYYMMDD');
    const cs = await this.csService.getByCode(dto.yoyangno);
    cs?.emcode;
    if (!cs) {
      throw new UnprocessableEntityException(
        '해당 요양기관 코드에 대한 정보가 없습니다.',
      );
    }
    const em = await this.emService.getByCode(cs.emcode ?? '');

    // 유니크 키가 겹치면 예외
    const existingRequest = await this.prisma.asrequest.findFirst({
      where: {
        ascode: dto.ascode,
        asymd: ymd,
        yoyangno: dto.yoyangno,
      },
    });

    if (existingRequest) {
      throw new UnprocessableEntityException(
        '이미 해당 날짜에 신청된 부가서비스가 있습니다.',
      );
    }

    // 트랜잭션으로 모든 DB 작업 수행
    await this.prisma.$transaction(async (tx) => {
      await tx.asrequest.create({
        data: {
          ascode: dto.ascode,
          asmyung: dto.asmyung,
          asymd: ymd,
          yoyangno: dto.yoyangno,
          hosdamdang: dto.hosdamdang,
          hosdamdangtel: dto.hosdamdangtel,
          cymd: '',
          asjoin: '0',
          asstate: '0',
          etc1: '',
          etc2: '',
          etc3: '',
          hosmyung: cs?.myung || '',
          damdangcode: em?.code || '',
          damdangmyung: em?.name || '',
        },
      });

      if (dto.permission.personalInfo)
        await this.upsertPinfo(tx, dto, '1', ymd);

      if (dto.permission.marketing) await this.upsertPinfo(tx, dto, '2', ymd);
    });

    // 고객용 SMS 메시지
    await this.smsService.sendMessage({
      phoneNumber: dto.hosdamdangtel,
      message: dto.smsMessage.customer,
    });

    if (em?.hpTel)
      // 담당자용 SMS 메시지
      await this.smsService.sendMessage({
        phoneNumber: em.hpTel,
        message: dto.smsMessage.manager,
      });

    return { success: true };
  }
}
