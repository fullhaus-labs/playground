import { makeExecutableSchema } from '@graphql-tools/schema';
import { modules } from './modules';
import { directives } from './directives';

export const schema = makeExecutableSchema({
  typeDefs: [...directives.typeDefs, ...modules.typeDefs],
  resolvers: [...modules.resolvers],
  schemaTransforms: [...directives.transformers],
  allowUndefinedInResolve: false
});
