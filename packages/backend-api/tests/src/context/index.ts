import { createFastifyTestContext } from './fastify';
import { createPrismaTestContext } from './prisma';
import { createWinstonTestContext } from './winston';
import { createLibTestContext } from './lib';
import { createEnvTestContext } from './env';

import type { FastifyServer } from 'backend-api/fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export interface TestContext {
  fastify: FastifyServer;
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
  env: Env;
}

export type CreateTestContext = () => TestContext;

export const createTestContext: CreateTestContext = () => {
  const context: Partial<TestContext> = {};

  const envContext = createEnvTestContext();
  const libContext = createLibTestContext();
  const winstonContext = createWinstonTestContext();
  const prismaContext = createPrismaTestContext();
  const fastifyContext = createFastifyTestContext();

  beforeAll(async () => {
    const env = await envContext.beforeAll();
    const lib = await libContext.beforeAll({ env });
    const winston = await winstonContext.beforeAll({ env: env.winston });
    const prisma = await prismaContext.beforeAll({ env: env.prisma });
    const fastify = await fastifyContext.beforeAll({
      prisma,
      winston,
      lib,
      env: env.fastify
    });

    Object.assign(context, { fastify, prisma, winston, lib, env });
  });

  afterEach(async () => {
    await prismaContext.afterEach();
  });

  afterAll(async () => {
    await fastifyContext.afterAll();
    await prismaContext.afterAll();
    await winstonContext.afterAll();
  });

  return context as TestContext;
};
