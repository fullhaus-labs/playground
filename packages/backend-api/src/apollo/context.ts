import type { FastifyRequest } from 'fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';

export interface GraphQLContext {
  request: FastifyRequest;
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
}

export interface GraphQLContextFactoryParams {
  request: FastifyRequest;
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
}

export type GraphQLContextFactory = (
  params: GraphQLContextFactoryParams
) => Promise<GraphQLContext>;

export const contextFactory: GraphQLContextFactory = async ({
  request,
  prisma,
  winston,
  lib
}) => ({ request, prisma, winston, lib });
