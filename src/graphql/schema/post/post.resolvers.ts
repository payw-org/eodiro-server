import { QueryResolvers } from '@/graphql/types'

export default {
  Query: {
    post: (root, { postId }, ctx) =>
      ctx.prisma.post.findOne({
        where: {
          postId,
        },
      }),
    posts: (root, { userId }, ctx) =>
      ctx.prisma.post.findMany({
        where: {
          userId,
        },
        orderBy: {
          postId: 'desc',
        },
      }),
  } as QueryResolvers,
}
