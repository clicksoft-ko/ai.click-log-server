import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/collect-db-schema-client';

@Injectable()
export class CollectDbPrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.COLLECT_DB_DATABASE_URL}`;

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
