import { createFastifyServer } from 'backend-api/fastify';

import type { FastifyServer } from 'backend-api/fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export interface FastifyTestContextBeforeAllParams {
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
  env: Env['fastify'];
}

export interface FastifyTestContext {
  beforeAll: (
    params: FastifyTestContextBeforeAllParams
  ) => Promise<FastifyServer>;
  afterAll: () => Promise<void>;
}

export type CreateFastifyTestContext = () => FastifyTestContext;

export const createFastifyTestContext: CreateFastifyTestContext = () => {
  let fastify: FastifyServer;

  return {
    beforeAll: async ({ prisma, winston, lib, env }) => {
      fastify = createFastifyServer({ prisma, winston, lib, env });

      return fastify;
    },
    afterAll: async () => {
      await fastify.close();
    }
  };
};
