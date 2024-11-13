import { Controller, Get, UseGuards } from '@nestjs/common';
import { CsService } from './cs.service';
import { HeaderGuard } from '@/common/guards/header.guard';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { apiHeader } from '@/constants/api-header';
import { GetNamesDto } from './dto/get-names.dto';

@Controller('cpm/cs')
export class CsController {
  constructor(private readonly csService: CsService) { }

  @ApiHeader({
    name: apiHeader.click.key,
    description: 'API를 사용하기 위해서 반드시 필요한 정보',
    required: true,
  })
  @ApiResponse({
    description: 'The names have been successfully retrieved.',
    type: [GetNamesDto],
  })
  @UseGuards(HeaderGuard)
  @Get("/names")
  async getNames() {
    return this.csService.getNames();
  }
}
