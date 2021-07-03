import {
  NonEmptyStringResolver,
  EmailAddressResolver,
  JWTResolver
} from 'graphql-scalars';

import type { Resolvers } from '../resolvers.gen';

export const resolvers: Resolvers = {
  Query: {
    _: () => null
  },
  Mutation: {
    _: () => null
  },
  NonEmptyString: NonEmptyStringResolver,
  EmailAddress: EmailAddressResolver,
  JWT: JWTResolver
};
