import type { DocumentNode } from 'graphql';
import type { Resolvers } from './resolvers.gen';

export interface GraphQLModule {
  typeDefs: DocumentNode;
  resolvers: Resolvers;
}
