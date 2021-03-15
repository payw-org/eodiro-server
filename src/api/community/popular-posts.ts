import { eodiroConst } from '@/constant'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeQueryValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import { SafeCommunityPost } from '@/types/schema'
import express from 'express'

const router = express.Router()

export type ApiCommunityGetPopularPostsReqQuery = {
  page?: number
}

export type ApiCommunityGetPopularPostsResData = {
  totalPage: number
  page: number
  popularPosts: SafeCommunityPost[]
}

const getPopularPostsQuery = makeQueryValidator<ApiCommunityGetPopularPostsReqQuery>()

router.get<
  any,
  ApiCommunityGetPopularPostsResData,
  any,
  ApiCommunityGetPopularPostsReqQuery
>(
  '/posts/popular',
  getPopularPostsQuery('page').isNumeric().toInt().optional(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { page = 1 } = req.query

    const take = eodiroConst.POSTS_TAKE_IN_ONE_PAGE
    const skip = Math.max(page - 1, 0) * take

    const totalPage = Math.ceil(
      (await prisma.communityPost.count({
        where: {
          likesCount: { gte: eodiroConst.POPULAR_POST_LIKES_THRESHOLD },
        },
      })) / take
    )

    const popularPosts = secureTable(
      await prisma.communityPost.findMany({
        where: {
          likesCount: { gte: eodiroConst.POPULAR_POST_LIKES_THRESHOLD },
          isDeleted: false,
        },
        orderBy: { id: 'desc' },
        skip,
        take,
      }),
      user.id
    )

    res.json({
      totalPage,
      popularPosts,
      page,
    })
  }
)

export default router
