import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinuxBackService } from './linux-back.service';
import {
  CreateLinuxBackDto,
  CreateLinuxBackSchema,
} from './dto/create-linux-back.dto';
import {
  UpdateLinuxBackDto,
  UpdateLinuxBackSchema,
} from './dto/update-linux-back.dto';
import {
  CreateLinuxBackDbDto,
  CreateLinuxBackDbSchema,
} from './dto/create-linux-back-db.dto';
import {
  CreateLinuxBackTblDto,
  CreateLinuxBackTblSchema,
} from './dto/create-linux-back-tbl.dto';

@ApiTags('ClickSoft - Linux Backup')
@Controller('clicksoft/linux-back')
export class LinuxBackController {
  constructor(private readonly linuxBackService: LinuxBackService) {}

  @Post()
  @ZodValidate(CreateLinuxBackSchema)
  create(@Body() dto: CreateLinuxBackDto) {
    return this.linuxBackService.createLinuxBack(dto);
  }

  @Patch(':id')
  @ZodValidate(UpdateLinuxBackSchema)
  update(@Param('id') id: string, @Body() dto: UpdateLinuxBackDto) {
    return this.linuxBackService.updateLinuxBack(id, dto);
  }

  @Get('latest')
  getLatest() {
    return this.linuxBackService.getLatestLinuxBacks();
  }

  @Post('db')
  @ZodValidate(CreateLinuxBackDbSchema)
  createDb(@Body() dto: CreateLinuxBackDbDto) {
    return this.linuxBackService.createLinuxBackDb(dto);
  }

  @Post('tbl')
  @ZodValidate(CreateLinuxBackTblSchema)
  createTbl(@Body() dto: CreateLinuxBackTblDto) {
    return this.linuxBackService.createLinuxBackTbl(dto);
  }
}
