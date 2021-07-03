import { makeExecutableSchema } from '@graphql-tools/schema';
import { modules } from './modules';

export const schema = makeExecutableSchema({
  typeDefs: [...modules.typeDefs],
  resolvers: [...modules.resolvers],
  allowUndefinedInResolve: false
});
