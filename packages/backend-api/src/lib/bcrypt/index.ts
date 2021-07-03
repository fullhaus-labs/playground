import { hash, compare } from 'bcrypt';

import type { Env } from 'backend-api/env';

export interface BCryptLib {
  hash: (data: string) => Promise<string>;
  compare: (data: string, encrypted: string) => Promise<boolean>;
}

export interface CreateBCryptLibParams {
  env: Env['bcrypt'];
}

export type CreateBCryptLib = (params: CreateBCryptLibParams) => BCryptLib;

export const createBCryptLib: CreateBCryptLib = ({ env }) => {
  const lib: BCryptLib = {
    hash: async (data) => await hash(data, env.hash.saltRounds),
    compare
  };

  return lib;
};
