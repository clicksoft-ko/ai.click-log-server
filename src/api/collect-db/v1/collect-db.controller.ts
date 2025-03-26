import { ZodValidate } from '@/common/decorators/zod-validate';
import { HeaderGuard } from '@/common/guards/header.guard';
import { apiHeader } from '@/constants/api-header';
import { Body, Controller, Get, HttpCode, HttpException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectDbService } from './collect-db.service';
import { CreateChDto, CreateChSchema } from './dto/create-ch.dto';
import { CreateSkLikeCountDto, CreateSkLikeCountDtoSchema } from './dto/sk-like-count.dto';
import { Request } from 'express'
import { getIp } from '@/shared/utils/ip.util';
import { Env } from '@/constants/env';

@ApiTags('collect-db/v1')
@Controller('collect-db/v1')
export class CollectDbController {
  constructor(private readonly collectDbService: CollectDbService) { }

  @Get("get-ip")
  async getHello(@Req() req: Request) {
    return getIp(req);
  }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,
  })
  @UseGuards(HeaderGuard)
  @HttpCode(204)
  @Post('ch')
  @ZodValidate(CreateChSchema)
  async createCh(@Body() dto: CreateChDto) {
    await this.collectDbService.createCh(dto);
  }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,
  })
  @ApiOperation({ summary: '처방에 대한 상병 좋아요 개수 업데이트' })
  @UseGuards(HeaderGuard)
  @HttpCode(204)
  @Post('sk-like-count')
  @ZodValidate(CreateSkLikeCountDtoSchema)
  async upsertSkLikeCount(@Body() dto: CreateSkLikeCountDto, @Req() req: Request) {
    const ip = getIp(req);
    // 전주, 광주 아이피 제외   
    if (!Env.IS_TEST && ["127.0.0.1", "106.255.241.66", "112.221.219.75"].includes(ip)) {
      throw new HttpException(`Invalid IP: ${ip}`, 400);
    }
    await this.collectDbService.upsertSkLikeCount(dto);
  }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,
  })
  @ApiOperation({ summary: '처방에 대한 상병 좋아요 개수 조회' })
  @UseGuards(HeaderGuard)
  @Get('sk-like-count')
  async getSkLikeCount(@Query('ycode') ycode: string, @Query('skcode') skcode: string) {
    return this.collectDbService.getSkLikeCount(ycode, skcode);
  }
}
