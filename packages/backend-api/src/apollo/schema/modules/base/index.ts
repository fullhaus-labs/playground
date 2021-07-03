import { typeDefs } from './type-defs';
import { resolvers } from './resolvers';

import type { GraphQLModule } from '../module';

export const base: GraphQLModule = { typeDefs, resolvers };
