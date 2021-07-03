import type { GraphQLModule } from '../module';
import type { DocumentNode } from 'graphql';
import type { Resolvers } from '../resolvers.gen';

export interface GraphQLMergedModules {
  typeDefs: DocumentNode[];
  resolvers: Resolvers[];
}

export type MergeGraphQLModules = (
  modules: GraphQLModule[]
) => GraphQLMergedModules;

export const mergeGraphQLModules: MergeGraphQLModules = (modules) =>
  modules.reduce<GraphQLMergedModules>(
    (merged, module) => {
      merged.typeDefs.push(module.typeDefs);
      merged.resolvers.push(module.resolvers);

      return merged;
    },
    { typeDefs: [], resolvers: [] }
  );
