import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	// run the migrations
	await orm.getMigrator().up();

	// set up the sever
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver, PostResolver],
			validate: false,
		}),
		// we pass the orm in the context so we can use it inside the resolvers
		context: () => ({ em: orm.em }),
	});

	// this tells express to create a graphql endpoint
	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log('Server started on port: 4000');
	});
};

main().catch;
