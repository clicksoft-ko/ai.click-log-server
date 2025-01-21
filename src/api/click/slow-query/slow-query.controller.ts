import { ZodValidate } from '@/common/decorators/zod-validate';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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

@ApiTags('eClick - Slow Query')
@Controller('click/slow-query')
export class SlowQueryController {
  constructor(private readonly slowQueryService: SlowQueryService) {}

  @ApiResponse({ status: 201 })
  @Post()
  @ZodValidate(SaveSlowQuerySchema)
  saveSlowQuery(@Body() dto: SaveSlowQueryDto) {
    return this.slowQueryService.saveSlowQuery(dto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: SlowQueryDto })
  @Get()
  getSlowQuery(@Query(new ZodValidationPipe(YmdSchema)) query: YmdDto): Promise<
    {
      id: number;
      ykiho: string;
      computerName: string;
      assemblyName: string;
      className: string;
      methodName: string;
      queryString: string;
      executionSeconds: number;
      createdAt: Date;
    }[]
  > {
    return this.slowQueryService.getSlowQuery(query);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [StackframeDto] })
  @Get('/:id/stackFrames')
  getSlowQueryStackFrames(@Param('id') id: string) {
    return this.slowQueryService.getSlowQueryStackFrames(parseInt(id));
  }
}
