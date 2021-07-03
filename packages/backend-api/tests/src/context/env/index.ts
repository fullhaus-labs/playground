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
        POSTGRES_SERVER_HOST: '0.0.0.0',
        POSTGRES_SERVER_PORT: '5432',
        POSTGRES_USER_NAME: 'fullhaus',
        POSTGRES_USER_PASSWORD: 'abc123xyz',
        POSTGRES_DATABASE_NAME: 'fullhaus-tests',
        POSTGRES_DATABASE_SCHEMA: 'public',
        WINSTON_LOGGER_LEVEL: 'none',
        NANOID_ID_LENGTH: '21'
      });

      return env;
    }
  };
};
