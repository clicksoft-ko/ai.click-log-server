import { DefaultArgs } from 'prisma/generated/cpm-schema-client/runtime/library';
import { Prisma, PrismaClient } from 'prisma/generated/cpm-schema-client/wasm';

export type CpmTransactionPrismaClient = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
