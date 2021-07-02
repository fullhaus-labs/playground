import { customAlphabet, urlAlphabet } from 'nanoid';
import { customAlphabet as customAlphabetAsync } from 'nanoid/async';

import type { Env } from 'backend-api/env';

export interface NanoIDLib {
  sync: () => string;
  async: () => Promise<string>;
}

export interface CreateNanoIDLibParams {
  env: Env['nanoid'];
}

export type CreateNanoIDLib = (params: CreateNanoIDLibParams) => NanoIDLib;

export const createNanoIDLib: CreateNanoIDLib = ({ env }) => {
  const lib: NanoIDLib = {
    sync: customAlphabet(urlAlphabet, env.id.length),
    async: customAlphabetAsync(urlAlphabet, env.id.length)
  };

  return lib;
};
