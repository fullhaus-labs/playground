import { createFastifyTestContext } from './fastify';
import { createWinstonTestContext } from './winston';
import { createLibTestContext } from './lib';
import { createEnvTestContext } from './env';

import type { FastifyServer } from 'backend-api/fastify';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export interface TestContext {
  fastify: FastifyServer;
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
  const fastifyContext = createFastifyTestContext();

  beforeAll(async () => {
    const env = await envContext.beforeAll();
    const lib = await libContext.beforeAll({ env });
    const winston = await winstonContext.beforeAll({ env: env.winston });
    const fastify = await fastifyContext.beforeAll({
      winston,
      lib,
      env: env.fastify
    });

    Object.assign(context, { fastify, winston, lib, env });
  });

  afterAll(async () => {
    await fastifyContext.afterAll();
    await winstonContext.afterAll();
  });

  return context as TestContext;
};
