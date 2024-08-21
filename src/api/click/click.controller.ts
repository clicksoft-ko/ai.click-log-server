import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClickService } from './click.service';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';
import { ZodValidate } from '@/common/decorators/zod-validate';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto) {
    return this.clickService.saveErrorLog(dto);
  }

}
