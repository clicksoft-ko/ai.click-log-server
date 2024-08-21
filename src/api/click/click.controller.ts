import { ZodValidate } from '@/common/decorators/zod-validate';
import { Body, Controller, Ip, Post } from '@nestjs/common';
import { ClickService } from './click.service';
import { ErrorLogSchema, SaveErrorLogDto } from './dto/save-error-log.dto';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @Post("/error-log")
  @ZodValidate(ErrorLogSchema)
  saveErrorLog(@Body() dto: SaveErrorLogDto, @Ip() ip: string) {
    return this.clickService.saveErrorLog(dto, ip);
  }
}
