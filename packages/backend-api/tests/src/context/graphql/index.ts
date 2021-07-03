import { createGraphQLTestSDK } from './sdk';

import type { GraphQLTestSDK } from './sdk';
import type { FastifyServer } from 'backend-api/fastify';

export interface GraphQLTestContextBeforeAllParams {
  fastify: FastifyServer;
}

export interface GraphQLTestContext {
  beforeAll: (
    params: GraphQLTestContextBeforeAllParams
  ) => Promise<GraphQLTestSDK>;
}

export type CreateGraphQLTestContext = () => GraphQLTestContext;

export const createGraphQLTestContext: CreateGraphQLTestContext = () => {
  let graphql: GraphQLTestSDK;

  return {
    beforeAll: async ({ fastify }) => {
      graphql = createGraphQLTestSDK({ fastify });

      return graphql;
    }
  };
};
