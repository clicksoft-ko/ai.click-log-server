import { Injectable } from '@nestjs/common';
import { ClickPrismaService } from './database/prisma/click-prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: ClickPrismaService) { }
  async getHello() {
    return "hello";
  }
}
