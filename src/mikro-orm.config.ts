import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';

export default {
	dbName: 'lireddit',
	user: 'postgres',
	password: 'postgres',
	debug: !__prod__,
    type: 'postgresql',
	// this will correspond to all our DB tables
	entities: [Post],
} as Parameters<typeof MikroORM.init>[0];

// 'as const' is casting to const, so we get to see the whole value or a property and not just
// the type
