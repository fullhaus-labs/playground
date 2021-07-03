import { getSdk } from './generic-sdk.gen';
import { print } from 'graphql';

import { GraphQLTestSDKError } from './errors';

import type { Requester } from './generic-sdk.gen';
import type {
  DocumentNode,
  OperationDefinitionNode,
  ExecutionResult
} from 'graphql';

import type { FastifyServer } from 'backend-api/fastify';

export interface RequesterOptions {
  headers?: Record<string, string>;
}

const validDocumentDefinitionOperations = new Set([
  'query',
  'mutation',
  'subscription'
]);

export interface CreateGraphQLTestSDKParams {
  fastify: FastifyServer;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createGraphQLTestSDK = (params: CreateGraphQLTestSDKParams) => {
  const requester: Requester<RequesterOptions> = async <Result, Variables>(
    document: DocumentNode,
    variables: Variables,
    options?: RequesterOptions
  ): Promise<Result> => {
    const definition = document.definitions.find(
      (definition) =>
        definition.kind === 'OperationDefinition' &&
        validDocumentDefinitionOperations.has(definition.operation)
    ) as OperationDefinitionNode | undefined;
    if (definition === undefined) {
      throw new Error(
        'document node passed to sdk must contain single query or mutation'
      );
    }

    switch (definition.operation) {
      case 'query':
      case 'mutation': {
        const response = await params.fastify.inject({
          method: 'POST',
          url: '/graphql',
          payload: {
            query: print(document),
            variables
          },
          headers: options?.headers
        });

        const body = response.json<ExecutionResult>();

        if (body.errors !== undefined) {
          throw new GraphQLTestSDKError(body.errors);
        }

        if (body.data === undefined || body.data === null) {
          throw new Error(
            'graphql response data missing in successful response'
          );
        }

        return body.data as Result;
      }
      case 'subscription': {
        throw new Error(
          'graphql subscription requests are not supported through sdk'
        );
      }
    }
  };

  return getSdk(requester);
};

export type GraphQLTestSDK = ReturnType<typeof createGraphQLTestSDK>;

export { GraphQLTestSDKError };
