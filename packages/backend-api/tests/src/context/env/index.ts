import { getEnv } from 'backend-api/env';

import type { Env } from 'backend-api/env';

export interface EnvTestContext {
  beforeAll: () => Promise<Env>;
}

export type CreateEnvTestContext = () => EnvTestContext;

export const createEnvTestContext: CreateEnvTestContext = () => {
  let env: Env;

  return {
    beforeAll: async () => {
      env = getEnv({
        NODE_ENV: 'test',
        FASTIFY_SERVER_HOST: '0.0.0.0',
        FASTIFY_SERVER_PORT: '4000',
        WINSTON_LOGGER_LEVEL: 'none',
        NANOID_ID_LENGTH: '21'
      });

      return env;
    }
  };
};
