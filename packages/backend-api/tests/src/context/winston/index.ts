import { createWinstonLogger } from 'backend-api/winston';

import type { WinstonLogger } from 'backend-api/winston';
import type { Env } from 'backend-api/env';

export interface WinstonTestContextBeforeAllParams {
  env: Env['winston'];
}

export interface WinstonTestContext {
  beforeAll: (
    params: WinstonTestContextBeforeAllParams
  ) => Promise<WinstonLogger>;
  afterAll: () => Promise<void>;
}

export type CreateWinstonTestContext = () => WinstonTestContext;

export const createWinstonTestContext: CreateWinstonTestContext = () => {
  let winston: WinstonLogger;

  return {
    beforeAll: async ({ env }) => {
      winston = createWinstonLogger({ env });

      return winston;
    },
    afterAll: async () => {
      await winston.end();
    }
  };
};
