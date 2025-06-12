import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { koDayjs } from '@/shared/utils/date.util';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CsService } from '../cs/cs.service';
import { EmService } from '../em/em.service';
import { ApplyAsRequestResponseDto } from './dto/apply-asrequest-response.dto';
import { ApplyAsRequestDto } from './dto/apply-asrequest.dto';

@Injectable()
export class AsrequestService {
  constructor(
    private readonly prisma: CpmPrismaService,
    private readonly csService: CsService,
    private readonly emService: EmService,
  ) {}

  async applyAdditionalService(
    dto: ApplyAsRequestDto,
  ): Promise<ApplyAsRequestResponseDto> {
    const ymd = koDayjs().format('YYYYMMDD');
    const cs = await this.csService.getByCode(dto.yoyangno);
    cs?.emcode;
    if (!cs) {
      throw new UnprocessableEntityException('해당 요양기관 코드에 대한 정보가 없습니다.');
    }
    const em = await this.emService.getByCode(cs.emcode ?? '');

    await this.prisma.asrequest.create({
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

    return { success: true };
  }
}
