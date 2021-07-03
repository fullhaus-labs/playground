import { sign, verify } from 'jsonwebtoken';

import type { Env } from 'backend-api/env';

export interface JWTLib {
  sign: (data: Record<string, unknown>) => string;
  verify: (token: string) => Record<string, unknown>;
}

export interface CreateJWTLibParams {
  env: Env['jwt'];
}

export type CreateJWTLib = (params: CreateJWTLibParams) => JWTLib;

export const createJWTLib: CreateJWTLib = ({ env }) => {
  const lib: JWTLib = {
    sign: (data) =>
      sign({ data }, env.signature.secret, {
        algorithm: env.signature.algorithm,
        issuer: env.claims.issuer,
        audience: env.claims.audience,
        expiresIn: env.claims.expirationInSeconds
      }),
    verify: (token) =>
      (
        verify(token, env.signature.secret, {
          algorithms: [env.signature.algorithm],
          issuer: env.claims.issuer,
          audience: env.claims.audience
        }) as { data: Record<string, unknown> }
      ).data
  };

  return lib;
};
