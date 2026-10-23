import { Injectable } from '@nestjs/common';
import { SaveErrorLogDto } from './dto/save-error-log.dto';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { paginateByIdDesc } from '@/shared/utils/stream-json.util';

// 행 하나의 본문(에러 메시지·쿼리 문자열 등)에 길이 제한이 없어 배치를 작게 잡는다
const BATCH_SIZE = 1000;

@Injectable()
export class ErrorLogService {
  constructor(private prisma: ClickPrismaService) {}

  /** 기간 내 에러 로그를 배치 단위로 내보낸다 (결과 전체를 메모리에 모으지 않음) */
  getErrorLogBatches({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) {
    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    return paginateByIdDesc(
      (cursor, take) =>
        this.prisma.errorLog.findMany({
          where: {
            // endDate 는 포함하지 않는다 (하루 경계를 반열림 구간으로 맞춤)
            createdAt: { gte: isoStartDate, lt: isoEndDate },
            id: cursor === undefined ? undefined : { lt: cursor },
          },
          // 목록 화면이 쓰는 칸만 보낸다. additionalData(행마다 수백 자)·source 는
          // 화면에서 쓰지 않는데 응답 크기의 절반 이상을 차지해 뺐다
          select: {
            id: true,
            createdAt: true,
            ykiho: true,
            computerName: true,
            moduleName: true,
            logLevel: true,
            exceptionType: true,
            errorMessage: true,
            clientVersion: true,
          },
          orderBy: { id: 'desc' },
          take,
        }),
      BATCH_SIZE,
    );
  }

  saveErrorLog(dto: SaveErrorLogDto, ip: string | undefined) {
    return this.prisma.errorLog.create({
      data: {
        ykiho: dto.ykiho,
        computerName: dto.computerName,
        moduleName: dto.moduleName,
        logLevel: dto.logLevel,
        exceptionType: dto.exceptionType,
        errorMessage: dto.errorMessage,
        stackTrace: dto.stackTrace || null,
        source: dto.source || null,
        additionalData: { ...dto.additionalData, ip },
        clientVersion: dto.clientVersion,
      },
    });
  }

  async getStacktrace(id: number) {
    const errorLog = await this.prisma.errorLog.findUnique({
      select: { stackTrace: true },
      where: { id },
    });
    return { stackTrace: errorLog?.stackTrace };
  }
}
