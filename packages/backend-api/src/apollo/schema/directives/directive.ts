import type { DocumentNode } from 'graphql';
import type { ExecutableSchemaTransformation } from '@graphql-tools/schema';

export interface GraphQLSchemaDirective {
  typeDefs: DocumentNode;
  transformer: ExecutableSchemaTransformation;
}
