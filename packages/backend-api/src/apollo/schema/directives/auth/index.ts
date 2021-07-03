import { typeDefs } from './type-defs';
import { transformer } from './transformer';

import type { GraphQLSchemaDirective } from '../directive';

export const auth: GraphQLSchemaDirective = { typeDefs, transformer };
