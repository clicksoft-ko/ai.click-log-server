import { Injectable } from '@nestjs/common';
import { SaveErrorLogDto } from './dto/save-error-log.dto';
import { PrismaService } from '@/database/prisma/prisma.service';
import { dbNow } from '@/shared/utils/date.util';

@Injectable()
export class ClickService {
  constructor(private prisma: PrismaService) { }

  saveErrorLog(dto: SaveErrorLogDto, ip: string | undefined) {
    return this.prisma.errorLog.create({
      data: {
        ykiho: dto.ykiho,
        computerName: dto.computerName,
        applicationName: dto.applicationName,
        logLevel: dto.logLevel,
        errorMessage: dto.errorMessage,
        stackTrace: dto.stackTrace || null,
        source: dto.source || null,
        createdAt: dbNow(),
        additionalData: { ...dto.additionalData, ip },
      },
    });
  }
}
