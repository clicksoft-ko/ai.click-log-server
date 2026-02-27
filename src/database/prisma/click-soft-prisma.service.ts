import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/clicksoft-schema-client/client';

@Injectable()
export class ClickSoftPrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.CLICKSOFT_DATABASE_URL}`;

    const adapter = new PrismaPg({ connectionString }, { schema: 'public' });
    super({ adapter });
  }
}
