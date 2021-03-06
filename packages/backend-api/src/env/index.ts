import { cleanEnv, num, str, port, host } from 'envalid';
import { URL, URLSearchParams } from 'url';
import path from 'path';

import type { WinstonLogLevel } from '../winston';
import type { Algorithm } from 'jsonwebtoken';

export interface Env {
  node: { env: NodeJS.Environments };
  fastify: { server: { host: string; port: number } };
  prisma: { database: { url: URL } };
  winston: { logger: { level: WinstonLogLevel } };
  nanoid: { id: { length: number } };
  bcrypt: { hash: { saltRounds: number } };
  jwt: {
    signature: { algorithm: Algorithm; secret: string };
    claims: { issuer: string; audience: string; expirationInSeconds: number };
  };
}

export type EnvVariables = Record<string, string | undefined>;

export type GetEnv = (variables: EnvVariables) => Env;

export const getEnv: GetEnv = (variables) => {
  const parsed = cleanEnv(variables, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    FASTIFY_SERVER_HOST: host(),
    FASTIFY_SERVER_PORT: port(),
    POSTGRES_SERVER_HOST: host(),
    POSTGRES_SERVER_PORT: port(),
    POSTGRES_USER_NAME: str(),
    POSTGRES_USER_PASSWORD: str(),
    POSTGRES_DATABASE_NAME: str(),
    POSTGRES_DATABASE_SCHEMA: str(),
    WINSTON_LOGGER_LEVEL: str({
      choices: ['fatal', 'error', 'warn', 'info', 'debug', 'none']
    }),
    NANOID_ID_LENGTH: num(),
    BCRYPT_HASH_SALT_ROUNDS: num(),
    JWT_SIGNATURE_ALGORITHM: str({ choices: ['HS256', 'HS384', 'HS512'] }),
    JWT_SIGNATURE_SECRET: str(),
    JWT_CLAIMS_ISSUER: str(),
    JWT_CLAIMS_AUDIENCE: str(),
    JWT_CLAIMS_EXPIRATION_IN_SECONDS: num()
  });

  const prismaDatabaseURL = new URL(
    `postgres://${parsed.POSTGRES_SERVER_HOST}:${parsed.POSTGRES_SERVER_PORT}`
  );
  prismaDatabaseURL.username = parsed.POSTGRES_USER_NAME;
  prismaDatabaseURL.password = parsed.POSTGRES_USER_PASSWORD;
  prismaDatabaseURL.pathname = path.join(parsed.POSTGRES_DATABASE_NAME);

  const prismaDatabaseURLSearchParams = new URLSearchParams();
  prismaDatabaseURLSearchParams.set('schema', parsed.POSTGRES_DATABASE_SCHEMA);

  prismaDatabaseURL.search = prismaDatabaseURLSearchParams.toString();

  const env: Env = {
    node: { env: parsed.NODE_ENV as NodeJS.Environments },
    fastify: {
      server: {
        host: parsed.FASTIFY_SERVER_HOST,
        port: parsed.FASTIFY_SERVER_PORT
      }
    },
    prisma: { database: { url: prismaDatabaseURL } },
    winston: {
      logger: { level: parsed.WINSTON_LOGGER_LEVEL as WinstonLogLevel }
    },
    nanoid: {
      id: {
        length: parsed.NANOID_ID_LENGTH
      }
    },
    bcrypt: { hash: { saltRounds: parsed.BCRYPT_HASH_SALT_ROUNDS } },
    jwt: {
      signature: {
        algorithm: parsed.JWT_SIGNATURE_ALGORITHM as Algorithm,
        secret: parsed.JWT_SIGNATURE_SECRET
      },
      claims: {
        issuer: parsed.JWT_CLAIMS_ISSUER,
        audience: parsed.JWT_CLAIMS_AUDIENCE,
        expirationInSeconds: parsed.JWT_CLAIMS_EXPIRATION_IN_SECONDS
      }
    }
  };

  return env;
};
