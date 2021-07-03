import type { GraphQLSchemaDirective } from '../directive';
import type { DocumentNode } from 'graphql';
import type { ExecutableSchemaTransformation } from '@graphql-tools/schema';

export interface GraphQLMergedSchemaDirectives {
  typeDefs: DocumentNode[];
  transformers: ExecutableSchemaTransformation[];
}

export type MergeGraphQLModules = (
  directives: GraphQLSchemaDirective[]
) => GraphQLMergedSchemaDirectives;

export const mergeGraphSchemaDirectives: MergeGraphQLModules = (modules) =>
  modules.reduce<GraphQLMergedSchemaDirectives>(
    (merged, module) => {
      merged.typeDefs.push(module.typeDefs);
      merged.transformers.push(module.transformer);

      return merged;
    },
    { typeDefs: [], transformers: [] }
  );
