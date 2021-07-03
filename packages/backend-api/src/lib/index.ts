import { createNanoIDLib } from './nanoid';
import { createBCryptLib } from './bcrypt';
import { createJWTLib } from './jwt';

import type { NanoIDLib } from './nanoid';
import type { BCryptLib } from './bcrypt';
import type { JWTLib } from './jwt';

import type { Env } from 'backend-api/env';

export interface Lib {
  nanoid: NanoIDLib;
  bcrypt: BCryptLib;
  jwt: JWTLib;
}

export interface CreateLibParams {
  env: Pick<Env, 'nanoid' | 'bcrypt' | 'jwt'>;
}

export type CreateLib = (params: CreateLibParams) => Lib;

export const createLib: CreateLib = ({ env }) => {
  const lib: Lib = {
    nanoid: createNanoIDLib({ env: env.nanoid }),
    bcrypt: createBCryptLib({ env: env.bcrypt }),
    jwt: createJWTLib({ env: env.jwt })
  };

  return lib;
};
