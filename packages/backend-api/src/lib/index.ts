import { createNanoIDLib } from './nanoid';

import type { NanoIDLib } from './nanoid';

import type { Env } from 'backend-api/env';

export interface Lib {
  nanoid: NanoIDLib;
}

export interface CreateLibParams {
  env: Pick<Env, 'nanoid'>;
}

export type CreateLib = (params: CreateLibParams) => Lib;

export const createLib: CreateLib = ({ env }) => {
  const lib: Lib = {
    nanoid: createNanoIDLib({ env: env.nanoid })
  };

  return lib;
};
