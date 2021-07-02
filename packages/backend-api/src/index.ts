import { createFastifyServer } from './fastify';
import { createWinstonLogger } from './winston';
import { createTerminus } from '@godaddy/terminus';
import { createLib } from './lib';
import { getEnv } from './env';

export type Start = () => Promise<void>;

export const start: Start = async () => {
  const env = getEnv(process.env);
  const lib = createLib({ env });
  const winston = createWinstonLogger({ env: env.winston });
  const fastify = createFastifyServer({ winston, lib, env: env.fastify });

  const signals: NodeJS.Signals[] = ['SIGTERM'];
  if (env.node.env === 'development') {
    signals.push('SIGINT');
  }

  createTerminus(fastify.server, {
    signals,
    onShutdown: async () => {
      winston.info('fastify server has stopped');

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
