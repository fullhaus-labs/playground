import { ApolloServer, ApolloError } from 'apollo-server-fastify';
import { schema } from './schema';
import { contextFactory } from './context';
import { ApolloServerLogging } from './plugins/logging';

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';

export type { ApolloServer };

export interface CreateGraphQLEnvelopParams {
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
}

export type CreateApolloServer = (
  params: CreateGraphQLEnvelopParams
) => ApolloServer;

interface ApolloServerFastifyContext {
  request: FastifyRequest;
  reply: FastifyReply;
}

export const createApolloServer: CreateApolloServer = ({
  prisma,
  winston,
  lib
}) => {
  const apollo = new ApolloServer({
    schema,
    context: async ({ request }: ApolloServerFastifyContext) =>
      await contextFactory({ request, prisma, winston, lib }),
    plugins: [ApolloServerLogging()],
    formatError: (error) =>
      error.originalError === undefined
        ? error
        : error.originalError instanceof ApolloError
        ? error.originalError
        : new ApolloError(
            'graphql operation has reached unexpected state',
            'INTERNAL_SERVER_ERROR'
          )
  });

  return apollo;
};
