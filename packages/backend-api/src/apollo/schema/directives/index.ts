import { mergeGraphSchemaDirectives } from './utils/merge';

import { auth } from './auth';

export const directives = mergeGraphSchemaDirectives([auth]);
