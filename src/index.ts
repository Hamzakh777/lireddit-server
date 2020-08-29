import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	// run the migrations
	await orm.getMigrator().up();

	// set up the sever
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver],
			validate: false,
		}),
	});

	// this tells express to create a graphql endpoint
	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log('Server started on port: 4000');
	});
};

main().catch;
