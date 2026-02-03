import { Injectable } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'generated/cpm-schema-client';

@Injectable()
export class CpmPrismaService extends PrismaClient {
  constructor() {
    const url = new URL(process.env.CPM_DATABASE_URL!);
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      connectionLimit: 5,
    });
    super({ adapter });
  }
}
