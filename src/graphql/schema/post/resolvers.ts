import { QueryResolvers } from '@/graphql/types'

export default {
  Query: {
    post: (root, { id }, ctx) =>
      ctx.prisma.post.findOne({
        where: {
          id,
        },
      }),
    posts: (root, args, ctx) =>
      ctx.prisma.post.findMany({
        orderBy: {
          id: 'desc',
        },
      }),
  } as QueryResolvers,
}
