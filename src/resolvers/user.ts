import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field } from 'type-graphql';
import { IContext } from 'src/types';
import { User } from '../entities/User';
import { MinLength } from 'class-validator';

@InputType()
class UserInput {
	@Field()
	username: string;

	@Field()
	@MinLength(10, {
		message: 'Password is too short',
	})
	password?: string;
}

@Resolver()
export class UserResolver {
	// register user
	@Mutation(() => User)
	async register(
		@Arg('options') options: UserInput,
		@Ctx() { em }: IContext
	): Promise<User> {
		const user = em.create(User, options);
		await em.persistAndFlush(user);

		return user;
	}

	// register user
	@Mutation(() => User)
	async login(
		@Arg('options') options: UserInput,
		@Ctx() { em }: IContext
	): Promise<User> {
		const user = em.create(User, options);
		await em.persistAndFlush(user);

		return user;
	}
}
