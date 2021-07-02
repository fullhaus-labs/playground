import type { FastifySchema } from 'fastify';
import type { JSONSchema7 } from 'json-schema';

export interface MakeFastifySchemaParams {
  headers?: JSONSchema7;
  params?: JSONSchema7;
  querystring?: JSONSchema7;
  body?: JSONSchema7;
}

export type MakeFastifySchema = (
  params?: MakeFastifySchemaParams
) => FastifySchema;

export const makeFastifySchema: MakeFastifySchema = ({
  headers,
  params,
  querystring,
  body
} = {}) => ({
  headers,
  params,
  querystring,
  body
});
