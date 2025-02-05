import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';
import { CpmPrismaService } from '@/database/prisma/cpm-prisma.service';
import { EnvService } from '@/modules/env/env.service';
import { CollectDbPrismaService } from '@/database/prisma/collect-db-prisma.service';

export let app: INestApplication;
export let clickPrisma: ClickPrismaService;
export let collectDbPrisma: CollectDbPrismaService;
export let cpmPrisma: CpmPrismaService;
export let envService: EnvService;
interface MockProvider {
  provide: any;
  useValue: any;
}

export const setupTestEnvironment = async (
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
