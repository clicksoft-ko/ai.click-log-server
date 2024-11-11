import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ClickPrismaService } from '@/database/prisma/click-prisma.service';

export let app: INestApplication;
export let clickPrisma: ClickPrismaService;
interface MockProvider {
  provide: any;
  useValue: any;
}

export const setupTestEnvironment = async (mockProviders: MockProvider[] = []) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  mockProviders.forEach(mockProvider =>
    moduleBuilder.overrideProvider(mockProvider.provide).useValue(mockProvider.useValue),
  )

  const moduleFixture: TestingModule = await moduleBuilder.compile();
  clickPrisma = moduleFixture.get(ClickPrismaService);

  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
};