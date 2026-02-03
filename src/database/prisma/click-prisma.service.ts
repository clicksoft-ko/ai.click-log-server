import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/click-schema-client';

@Injectable()
export class ClickPrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.CLICK_DATABASE_URL}`;

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
