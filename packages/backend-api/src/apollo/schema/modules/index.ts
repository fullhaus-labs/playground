import { mergeGraphQLModules } from './utils/merge';

import { base } from './base';
import { user } from './user';

export const modules = mergeGraphQLModules([base, user]);
