import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql';
import { Post } from '../entities/Post';
import { IContext } from 'src/types';

@Resolver()
export class PostResolver {
	// get posts
	@Query(() => [Post])
	posts(@Ctx() { em }: IContext): Promise<Post[]> {
		return em.find(Post, {});
	}

	// get post
	@Query(() => Post, { nullable: true })
	post(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: IContext
	): Promise<Post | null> {
		return em.findOne(Post, { id });
	}

	// create post
	@Mutation(() => Post)
	async createPost(
		@Arg('title', () => String) title: string,
		@Ctx() { em }: IContext
	): Promise<Post> {
		const post = em.create(Post, {
			title,
		});
		await em.persistAndFlush(post);

		return post;
	}

	// update post
	@Mutation(() => Post)
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string,
		@Ctx() { em }: IContext
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return null;
		}
		if (typeof title !== 'undefined') {
			post.title = title;
			em.persistAndFlush(post);
		}
		return post;
	}

	// delete post
	@Mutation(() => Boolean)
	async deletePost(
		@Arg('id') id: number,
		@Ctx() { em }: IContext
	): Promise<Boolean> {
		try {
			await em.nativeDelete(Post, { id });

			return true;
		} catch (error) {
			console.error(error);

			return false;
		}
	}
}
