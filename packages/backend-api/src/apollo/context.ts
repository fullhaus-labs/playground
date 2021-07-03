import {
  UserInputError,
  ForbiddenError,
  ApolloError
} from 'apollo-server-fastify';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import type { FastifyRequest } from 'fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';

export interface Me {
  userID: string;
}

export interface GraphQLContext {
  request: FastifyRequest;
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
  me: Me | null;
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
}) => {
  let me: Me | null = null;

  const authorizationHeader = request.headers.authorization;
  if (authorizationHeader !== undefined) {
    if (!authorizationHeader.startsWith('Bearer ')) {
      throw new UserInputError(
        'graphql operation has received bad user input',
        {
          reason:
            'authorization header does not follow bearer authentication scheme',
          headers: { authorization: authorizationHeader }
        }
      );
    }

    const token = authorizationHeader.replace(/Bearer /, '');

    let userID: string;

    try {
      ({ userID } = lib.jwt.verify(token) as { userID: string });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenError(
          'graphql operation has received expired bearer authentication header token'
        );
      }

      if (error instanceof JsonWebTokenError) {
        if (
          error.message === 'invalid token' ||
          error.message === 'jwt malformed'
        ) {
          throw new UserInputError(
            'graphql operation has received bad user input',
            {
              reason:
                'bearer authorization header token does not follow JWT scheme',
              headers: { authorization: authorizationHeader }
            }
          );
        }

        if (
          error.message === 'jwt signature is required' ||
          error.message === 'invalid signature'
        ) {
          throw new UserInputError(
            'graphql operation has received bad user input',
            {
              reason:
                'bearer authorization header token does not follow Fullhaus JWT scheme',
              headers: { authorization: authorizationHeader }
            }
          );
        }
      }

      throw new ApolloError(
        'graphql operation has reached unexpected state',
        'INTERNAL_SERVER_ERROR'
      );
    }

    me = { userID };
  }

  return { request, prisma, winston, lib, me };
};
