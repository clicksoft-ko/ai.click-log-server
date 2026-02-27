import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { LinuxBackService } from './linux-back.service';
import { ykihoSchema } from '@/api/click/validators/common.validator';
import {
  BackupTypeEnum,
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
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateLinuxBackSchema)) dto: UpdateLinuxBackDto,
  ) {
    return this.linuxBackService.updateLinuxBack(id, dto);
  }

  @Get('latest')
  @ApiQuery({ name: 'backupType', enum: ['DB', 'FILE'], required: false })
  getLatest(
    @Query('backupType', new ZodValidationPipe(BackupTypeEnum.optional()))
    backupType?: 'DB' | 'FILE',
  ) {
    return this.linuxBackService.getLatestLinuxBacks(backupType);
  }

  @Get('latest/:ykiho')
  @ApiQuery({ name: 'backupType', enum: ['DB', 'FILE'], required: false })
  getLatestByYkiho(
    @Param('ykiho', new ZodValidationPipe(ykihoSchema)) ykiho: string,
    @Query('backupType', new ZodValidationPipe(BackupTypeEnum.optional()))
    backupType?: 'DB' | 'FILE',
  ) {
    return this.linuxBackService.getLatestLinuxBackByYkiho(ykiho, backupType);
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
