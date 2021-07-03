import { fastify } from 'fastify';
import { makeFastifySchema } from './schema';
import {
  FastifyResponseError,
  FastifyRouteNotFoundError,
  FastifyBadRequestError,
  FastifyUnknownError
} from './errors';

import { parse as parseQuerystring } from 'qs';

import type { FastifyInstance, HTTPMethods } from 'fastify';
import type { PrismaClient } from 'backend-api/prisma';
import type { WinstonLogger } from 'backend-api/winston';
import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export type FastifyServer = Omit<FastifyInstance, 'listen'> & {
  listen: () => Promise<string>;
};

export interface CreateFastifyServerParams {
  prisma: PrismaClient;
  winston: WinstonLogger;
  lib: Lib;
  env: Env['fastify'];
}

export type CreateFastifyServer = (
  params: CreateFastifyServerParams
) => FastifyServer;

export const createFastifyServer: CreateFastifyServer = ({
  winston,
  lib,
  env
}) => {
  const instance = fastify({
    querystringParser: parseQuerystring,
    genReqId: () => lib.nanoid.sync()
  })
    .addHook('onRequest', async (request) => {
      winston.info('fastify server has incoming request', {
        id: request.id,
        request: {
          method: request.method,
          url: request.url.replace(/(\?.*)/, '')
        }
      });
    })
    .addHook('onResponse', async (request, reply) => {
      winston.info('fastify server has completed request', {
        id: request.id,
        request: {
          method: request.method,
          url: request.url.replace(/(\?.*)/, '')
        },
        response: {
          statusCode: reply.statusCode,
          timeInMilliseconds: Math.round(reply.getResponseTime() * 1000)
        }
      });
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .setNotFoundHandler(async (request) => {
      return new FastifyRouteNotFoundError({
        method: request.method as HTTPMethods,
        url: request.url.replace(/(\?.*)/, '')
      }).toResponse();
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .setErrorHandler(async (error, request) => {
      if (
        error.validationContext !== undefined &&
        error.validation !== undefined &&
        error.validation.length > 0
      ) {
        return new FastifyBadRequestError({
          context: error.validationContext,
          path: error.validation[0].dataPath.split('.').slice(1),
          reason: error.validation[0].message
        }).toResponse();
      }

      if (error instanceof FastifyResponseError) {
        return error.toResponse();
      }

      winston.error('fastify server has failed to execute request', {
        id: request.id,
        request: {
          method: request.method,
          url: request.url.replace(/(\?.*)/, '')
        },
        error
      });

      return new FastifyUnknownError().toResponse();
    })
    .route<{ Reply: { root: true } }>({
      method: 'GET',
      url: '/',
      schema: makeFastifySchema(),
      handler: async () => ({ root: true })
    });

  const listenFn = instance.listen.bind(instance);

  const server: FastifyServer = Object.assign(instance, {
    listen: async () =>
      await listenFn({ host: env.server.host, port: env.server.port })
  });

  return server;
};
