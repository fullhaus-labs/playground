import { createLib } from 'backend-api/lib';

import type { Lib } from 'backend-api/lib';
import type { Env } from 'backend-api/env';

export interface LibTestContextBeforeAllParams {
  env: Pick<Env, 'nanoid'>;
}

export interface LibTestContext {
  beforeAll: (params: LibTestContextBeforeAllParams) => Promise<Lib>;
}

export type CreateLibTestContext = () => LibTestContext;

export const createLibTestContext: CreateLibTestContext = () => {
  let lib: Lib;

  return {
    beforeAll: async ({ env }) => {
      lib = createLib({ env });

      return lib;
    }
  };
};
