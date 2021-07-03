import { PrismaClient } from '@prisma/client';

import type { Env } from 'backend-api/env';

export type { PrismaClient };

export interface CreatePrismaClientParams {
  env: Env['prisma'];
}

export type CreatePrismaClient = (
  params: CreatePrismaClientParams
) => PrismaClient;

export const createPrismaClient: CreatePrismaClient = ({ env }) => {
  const client = new PrismaClient({
    datasources: { db: { url: env.database.url.toString() } }
  });

  return client;
};
