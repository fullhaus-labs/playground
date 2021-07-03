import { mergeGraphQLModules } from './utils/merge';

import { base } from './base';
import { user } from './user';
import { auth } from './auth';

export const modules = mergeGraphQLModules([base, user, auth]);
