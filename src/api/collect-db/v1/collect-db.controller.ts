import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CollectDbService } from './collect-db.service';
import { CreateChDto, CreateChSchema } from './dto/create-ch.dto';
import { ZodValidate } from '@/common/decorators/zod-validate';
import { apiHeader } from '@/constants/api-header';
import { HeaderGuard } from '@/common/guards/header.guard';

@ApiTags('collect-db/v1')
@Controller('collect-db/v1')
export class CollectDbController {
  constructor(private readonly collectDbService: CollectDbService) {}

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true, // 헤더가 필수임을 명시
  })
  @UseGuards(HeaderGuard)
  @HttpCode(204)
  @Post('ch')
  @ZodValidate(CreateChSchema)
  create(@Body() dto: CreateChDto) {
    this.collectDbService.createCh(dto);
  }
}
