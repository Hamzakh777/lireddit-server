import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { IContext } from './types';

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	// run the migrations
	await orm.getMigrator().up();

	// set up the sever
	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();
	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ client: redisClient, disableTouch: true }),
			secret: 'keyboard cat',
			resave: false,
			cookie: {
				httpOnly: true, // will not be able to acces the cookie using just JS
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				secure: __prod__, // works only when using https
				sameSite: 'lax', // csrf
			}
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PostResolver],
			validate: false,
		}),
		// we pass the orm in the context so we can use it inside the resolvers
		context: ({ req, res }): IContext => ({ em: orm.em, req, res }),
	});

	// this tells express to create a graphql endpoint
	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log('Server started on port: 4000');
	});
};

main().catch;
