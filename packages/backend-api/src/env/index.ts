import { cleanEnv, num, str, port, host } from 'envalid';

import type { WinstonLogLevel } from '../winston';

export interface Env {
  node: { env: NodeJS.Environments };
  fastify: { server: { host: string; port: number } };
  winston: { logger: { level: WinstonLogLevel } };
  nanoid: { id: { length: number } };
}

export type EnvVariables = Record<string, string | undefined>;

export type GetEnv = (variables: EnvVariables) => Env;

export const getEnv: GetEnv = (variables) => {
  const parsed = cleanEnv(variables, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    FASTIFY_SERVER_HOST: host(),
    FASTIFY_SERVER_PORT: port(),
    WINSTON_LOGGER_LEVEL: str({
      choices: ['fatal', 'error', 'warn', 'info', 'debug', 'none']
    }),
    NANOID_ID_LENGTH: num()
  });

  const env: Env = {
    node: { env: parsed.NODE_ENV as NodeJS.Environments },
    fastify: {
      server: {
        host: parsed.FASTIFY_SERVER_HOST,
        port: parsed.FASTIFY_SERVER_PORT
      }
    },
    winston: {
      logger: { level: parsed.WINSTON_LOGGER_LEVEL as WinstonLogLevel }
    },
    nanoid: {
      id: {
        length: parsed.NANOID_ID_LENGTH
      }
    }
  };

  return env;
};
