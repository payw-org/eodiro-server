import { QueryResolvers } from '@/graphql/types'

export default {
  Query: {
    users: (root, args, ctx) => {
      return ctx.prisma.user.findMany({
        orderBy: {
          id: 'desc',
        },
        include: {
          posts: {
            orderBy: {
              id: 'desc',
            },
          },
        },
      })
    },
    user: (root, { id }, ctx) => {
      return ctx.prisma.user.findOne({
        where: {
          id,
        },
        include: {
          posts: {
            orderBy: {
              id: 'desc',
            },
          },
        },
      })
    },
  } as QueryResolvers,
}
