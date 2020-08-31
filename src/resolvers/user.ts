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

@InputType()
class UserInput {
	@Field()
	username: string;

	@Field()
	password: string;
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
	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UserInput,
		@Ctx() { em }: IContext
	): Promise<UserResponse> {
		if (options.username.length < 3) {
			return {
				errors: [
					{
						field: 'username',
						message: 'Username too short',
					},
				],
			};
		}
		if (options.password.length < 8) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Password length should be greater than 8',
					},
				],
			};
		}
		const user = em.create(User, options);
		// no password hashing because node argon 2 didn't want to install locally
		try {
			await em.persistAndFlush(user);
		} catch (error) {
			if (error.code === '23505') {
				// username already exists
				return {
					errors: [
						{
							field: 'username',
							message: 'User already taken'
						}
					]
				}	
			}
		}

		return {
			user,
		};
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
