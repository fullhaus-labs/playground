import { createFastifyServer } from './fastify';
import { createPrismaClient } from './prisma';
import { createWinstonLogger } from './winston';
import { createTerminus } from '@godaddy/terminus';
import { createLib } from './lib';
import { getEnv } from './env';

export type Start = () => Promise<void>;

export const start: Start = async () => {
  const env = getEnv(process.env);
  const lib = createLib({ env });
  const winston = createWinstonLogger({ env: env.winston });
  const prisma = createPrismaClient({ env: env.prisma });

  try {
    await prisma.$connect();
    winston.info('prisma client has connected');
  } catch (error) {
    winston.fatal('prisma client has failed to connect', { error });

    process.exit(1);
  }

  const fastify = createFastifyServer({
    prisma,
    winston,
    lib,
    env: env.fastify
  });

  const signals: NodeJS.Signals[] = ['SIGTERM'];
  if (env.node.env === 'development') {
    signals.push('SIGINT');
  }

  createTerminus(fastify.server, {
    signals,
    onShutdown: async () => {
      winston.info('fastify server has stopped');

      await prisma.$disconnect();
      winston.info('prisma client has disconnected');

      await winston.end();
    }
  });

  try {
    const url = await fastify.listen();
    winston.info('fastify server has started', { url });
  } catch (error) {
    winston.fatal('fastify server has failed to start', { error });

    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
