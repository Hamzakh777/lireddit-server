import {
	Resolver,
	Ctx,
	Arg,
	Mutation,
	InputType,
	Field,
	ObjectType,
} from 'type-graphql';
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

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	// ? makes it undefined if we don't set it
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
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
		// no password hashing because node argon 2 didn't want to install locally
		await em.persistAndFlush(user);

		return user;
	}

	// login
	@Mutation(() => UserResponse)
	async login(
		@Arg('options') options: UserInput,
		@Ctx() { em }: IContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: "The username doensn't exist",
					},
				],
			};
		}
		// no hashing because node argon 2 didn't want to install locally
		const valid = options.password === user.password;
		if (!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Invalid login',
					},
				],
			};
		}

		return {
			user,
		};
	}
}
