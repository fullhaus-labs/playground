import { createApolloServer } from 'backend-api/apollo';

import type { ApolloServer } from 'backend-api/apollo';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';

export interface ApolloTestContextBeforeAllParams {
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
}

export interface ApolloTestContext {
  beforeAll: (
    params: ApolloTestContextBeforeAllParams
  ) => Promise<ApolloServer>;
  afterAll: () => Promise<void>;
}

export type CreateApolloTestContext = () => ApolloTestContext;

export const createApolloTestContext: CreateApolloTestContext = () => {
  let apollo: ApolloServer;

  return {
    beforeAll: async ({ prisma, winston, lib }) => {
      apollo = createApolloServer({ prisma, winston, lib });
      await apollo.start();

      return apollo;
    },
    afterAll: async () => {
      await apollo.stop();
    }
  };
};
