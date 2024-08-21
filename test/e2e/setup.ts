import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';

export let app: INestApplication;

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


  app = moduleFixture.createNestApplication();
  await app.init();
};

export const teardownTestEnvironment = async () => {
  await app.close();
};