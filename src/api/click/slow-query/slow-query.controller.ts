import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { YmdDto, YmdSchema } from '../dto/ymd.dto';
import {
  SaveSlowQueryDto,
  SaveSlowQuerySchema,
} from './dto/save-slow-query.dto';
import { SlowQueryDto } from './dto/slow-query.dto';
import { SlowQueryService } from './slow-query.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { StackframeDto } from './dto/stackframe.dto';
import { streamJsonArray } from '@/shared/utils/stream-json.util';
import { Response } from 'express';

@ApiTags('eClick - Slow Query')
@Controller('click/slow-query')
export class SlowQueryController {
  private readonly logger = new Logger(SlowQueryController.name);

  constructor(private readonly slowQueryService: SlowQueryService) {}

  @ApiResponse({ status: 201 })
  @Post()
  @ZodValidate(SaveSlowQuerySchema)
  saveSlowQuery(@Body() dto: SaveSlowQueryDto) {
    return this.slowQueryService.saveSlowQuery(dto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [SlowQueryDto] })
  @Get()
  async getSlowQuery(
    @Query(new ZodValidationPipe(YmdSchema)) query: YmdDto,
    @Res() res: Response,
  ) {
    await streamJsonArray(
      res,
      this.slowQueryService.getSlowQueryBatches(query),
      (error) =>
        this.logger.warn(`슬로우 쿼리 응답 스트리밍 중단: ${error.message}`),
    );
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [StackframeDto] })
  @Get('/:id/stackFrames')
  getSlowQueryStackFrames(@Param('id') id: string) {
    return this.slowQueryService.getSlowQueryStackFrames(parseInt(id));
  }
}
