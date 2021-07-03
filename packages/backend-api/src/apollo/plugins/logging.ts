import { print } from 'graphql';

import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import type { GraphQLContext } from '../context';

export const ApolloServerLogging = (): ApolloServerPlugin<GraphQLContext> => {
  const logging: ApolloServerPlugin<GraphQLContext> = {
    requestDidStart: async () => ({
      executionDidStart: async ({
        document,
        context: { request, winston }
      }) => {
        winston.info('graphql has started to execute operation', {
          id: request.id,
          source: print(document).replace(/\s+/g, ' ')
        });

        return {
          executionDidEnd: async (error) => {
            if (error !== undefined) {
              winston.error('graphql has failed to execute operation', {
                id: request.id,
                source: print(document).replace(/\s+/g, ' '),
                error
              });
            }
          }
        };
      }
    })
  };

  return logging;
};
