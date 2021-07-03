import { createGraphQLTestContext } from './graphql';
import { createFastifyTestContext } from './fastify';
import { createApolloTestContext } from './apollo';
import { createPrismaTestContext } from './prisma';
import { createWinstonTestContext } from './winston';
import { createLibTestContext } from './lib';
import { createEnvTestContext } from './env';

import type { GraphQLTestSDK } from './graphql/sdk';
import type { FastifyServer } from 'backend-api/fastify';
import type { ApolloServer } from 'backend-api/apollo';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export interface TestContext {
  graphql: GraphQLTestSDK;
  fastify: FastifyServer;
  apollo: ApolloServer;
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
  const apolloContext = createApolloTestContext();
  const fastifyContext = createFastifyTestContext();
  const graphqlContext = createGraphQLTestContext();

  beforeAll(async () => {
    const env = await envContext.beforeAll();
    const lib = await libContext.beforeAll({ env });
    const winston = await winstonContext.beforeAll({ env: env.winston });
    const prisma = await prismaContext.beforeAll({ env: env.prisma });
    const apollo = await apolloContext.beforeAll({
      prisma,
      winston,
      lib
    });
    const fastify = await fastifyContext.beforeAll({
      apollo,
      prisma,
      winston,
      lib,
      env: env.fastify
    });
    const graphql = await graphqlContext.beforeAll({ fastify });

    Object.assign(context, {
      graphql,
      fastify,
      apollo,
      prisma,
      winston,
      lib,
      env
    });
  });

  afterEach(async () => {
    await prismaContext.afterEach();
  });

  afterAll(async () => {
    await fastifyContext.afterAll();
    await apolloContext.afterAll();
    await prismaContext.afterAll();
    await winstonContext.afterAll();
  });

  return context as TestContext;
};
