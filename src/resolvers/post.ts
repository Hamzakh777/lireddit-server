import { Resolver, Query, Ctx } from 'type-graphql';
import { Post } from '../entities/Post';
import { IContext } from 'src/types';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { em }: IContext): Promise<Post[]> {
		return em.find(Post, {});
	}
}
