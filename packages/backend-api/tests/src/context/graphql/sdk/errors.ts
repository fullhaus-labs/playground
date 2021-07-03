import type { GraphQLError } from 'graphql';

export class GraphQLTestSDKError extends Error {
  errors: readonly GraphQLError[];

  constructor(errors: readonly GraphQLError[]) {
    super('graphql operation has failed');

    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
