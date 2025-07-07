import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { EnvService } from '@/modules/env/env.service';
import { CollectDbPrismaService } from '@/database/prisma/collect-db-prisma.service';
import { SMS_DB_CONNECTION } from '@/common/providers/sms-db.providers';

export let app: INestApplication;
export let clickPrisma: ClickPrismaService;
export let collectDbPrisma: CollectDbPrismaService;
export let cpmPrisma: CpmPrismaService;
export let envService: EnvService;

interface MockProvider {
  provide: any;
  useValue: any;
}

const mockSqlPool = {
  request: jest.fn().mockReturnThis(), // request() 호출 시 자기 자신 반환 (체이닝 용이)
  input: jest.fn().mockReturnThis(), // input() 호출 시 자기 자신 반환 (체이닝 용이)
  query: jest.fn(), // query()는 실제 데이터나 에러를 반환하도록 테스트 케이스별로 설정
  close: jest.fn().mockResolvedValue(undefined), // close() 메서드 모킹 (정상 종료 가정)
};

export const setupTestEnvironment = async (
  mockProviders: MockProvider[] = [],
) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  moduleBuilder.overrideProvider(SMS_DB_CONNECTION).useValue(mockSqlPool);
  mockProviders.forEach((mockProvider) =>
    moduleBuilder
      .overrideProvider(mockProvider.provide)
      .useValue(mockProvider.useValue),
  );

  const moduleFixture: TestingModule = await moduleBuilder.compile();
  clickPrisma = moduleFixture.get(ClickPrismaService);
  app = moduleFixture.createNestApplication();
  await app.init();
};

export const setupCpmTestEnvironment = async (
  mockProviders: MockProvider[] = [],
) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  mockProviders.forEach((mockProvider) =>
    moduleBuilder
      .overrideProvider(mockProvider.provide)
      .useValue(mockProvider.useValue),
  );

  const moduleFixture: TestingModule = await moduleBuilder.compile();
  cpmPrisma = moduleFixture.get(CpmPrismaService);
  envService = moduleFixture.get(EnvService);

  app = moduleFixture.createNestApplication();
  await app.init();
};

export const setupCollectDbTestEnvironment = async (
  mockProviders: MockProvider[] = [],
) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  mockProviders.forEach((mockProvider) =>
    moduleBuilder
      .overrideProvider(mockProvider.provide)
      .useValue(mockProvider.useValue),
  );

  const moduleFixture: TestingModule = await moduleBuilder.compile();
  collectDbPrisma = moduleFixture.get(CollectDbPrismaService);
  envService = moduleFixture.get(EnvService);
  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
};
