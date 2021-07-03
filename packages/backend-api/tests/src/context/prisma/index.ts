import { createPrismaClient } from 'backend-api/prisma';
import execa from 'execa';
import { customAlphabet } from 'nanoid';
import { URL, URLSearchParams } from 'url';
import path from 'path';

import type { PrismaClient } from 'backend-api/prisma';
import type { Env } from 'backend-api/env';

const backendAPIDirectory = path.join(__dirname, '..', '..', '..', '..');
const prismaBinaryPath = path.join(
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma'
);

const hexAlphabet = '0123456789abcdef';
const schemaNanoID = customAlphabet(hexAlphabet, 10);
const generateDatabaseSchemaID = (): string => `test_${schemaNanoID()}`;

export interface PrismaTestContextBeforeAllParams {
  env: Env['prisma'];
}

export interface PrismaTestContext {
  beforeAll: (
    params: PrismaTestContextBeforeAllParams
  ) => Promise<PrismaClient>;
  afterEach: () => Promise<void>;
  afterAll: () => Promise<void>;
}

export type CreatePrismaTestContext = () => PrismaTestContext;

export const createPrismaTestContext: CreatePrismaTestContext = () => {
  let schema: string;
  let prisma: PrismaClient;

  return {
    beforeAll: async ({ env }) => {
      const databaseURL = new URL(env.database.url.toString());

      const databaseURLSearchParams = new URLSearchParams(
        env.database.url.searchParams
      );

      schema = generateDatabaseSchemaID();
      databaseURLSearchParams.set('schema', schema);

      databaseURL.search = databaseURLSearchParams.toString();

      await execa(prismaBinaryPath, ['db', 'push'], {
        cwd: backendAPIDirectory,
        env: {
          PRISMA_DATABASE_URL: databaseURL.toString()
        }
      });

      env.database.url = databaseURL;

      prisma = createPrismaClient({ env });
      await prisma.$connect();

      return prisma;
    },
    afterEach: async () => {
      await prisma.$executeRaw(`
        DO
        $func$
        BEGIN
          EXECUTE
          (
            SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' RESTART IDENTITY CASCADE'
            FROM pg_class
            WHERE relkind = 'r'
            AND relnamespace = '${schema}'::regnamespace
          );
        END
        $func$;
      `);
    },
    afterAll: async () => {
      await prisma.$executeRaw(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await prisma.$disconnect();
    }
  };
};
