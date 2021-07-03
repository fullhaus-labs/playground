import { mapSchema, getDirectives, MapperKind } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-fastify';
import { defaultFieldResolver } from 'graphql';

import type { GraphQLSchema, GraphQLFieldConfig } from 'graphql';
import type { GraphQLContext } from '../../../context';
import type { ExecutableSchemaTransformation } from '@graphql-tools/schema';

const directiveName = 'auth';

export const transformer: ExecutableSchemaTransformation = (
  schema: GraphQLSchema
) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, GraphQLContext>
    ) => {
      const directives = getDirectives(schema, fieldConfig);
      const authDirective = directives[directiveName];
      if (authDirective !== undefined) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = (source, args, context, info) => {
          if (context.me === null) {
            throw new AuthenticationError(
              'graphql operation has received unauthenticated request'
            );
          }

          return resolve(source, args, context, info);
        };

        return fieldConfig;
      }
    }
  });
