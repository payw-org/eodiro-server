import { QueryResolvers } from '@/graphql/types'

export default {
  Query: {
    users: (root, args, ctx) => {
      return ctx.prisma.user.findMany({
        orderBy: {
          userId: 'desc',
        },
        include: {
          posts: {
            orderBy: {
              postId: 'desc',
            },
          },
        },
      })
    },
    user: (root, { userId }, ctx) => {
      return ctx.prisma.user.findOne({
        where: {
          userId,
        },
        include: {
          posts: {
            orderBy: {
              postId: 'desc',
            },
          },
        },
      })
    },
  } as QueryResolvers,
}
