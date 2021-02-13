import { eodiroConst } from '@/constant'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeQueryValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import {
  SafeCommunityComment,
  SafeCommunityPost,
  SafeCommunitySubcomment,
} from '@/types/schema'
import { CommunityPostBookmark, CommunityPostLike } from '@prisma/client'
import express from 'express'

const router = express.Router()

export type ApiCommunityPostsListReqQuery = {
  boardId: number
  page?: number
}

export type ApiCommunityPostsListResData = {
  totalPage: number
  page: number
  posts: (SafeCommunityPost & {
    communityComments: (SafeCommunityComment & {
      communitySubcomments: SafeCommunitySubcomment[]
    })[]
    communityPostLikes: CommunityPostLike[]
    communityPostBookmarks: CommunityPostBookmark[]
  })[]
}

const query = makeQueryValidator<ApiCommunityPostsListReqQuery>()

router.get<
  any,
  ApiCommunityPostsListResData,
  any,
  ApiCommunityPostsListReqQuery
>(
  '/community/posts-list',
  query('boardId').isNumeric().toInt(),
  query('page').optional().isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { boardId, page = 1 } = req.query

    const take = eodiroConst.POSTS_TAKE_IN_ONE_PAGE
    const skip = Math.max(page - 1, 0) * take
    const totalPage = Math.ceil(
      (await prisma.communityPost.count({
        where: { isDeleted: false, communityBoard: { id: boardId } },
      })) / take
    )

    const posts = (secureTable(
      await prisma.communityPost.findMany({
        where: {
          isDeleted: false,
          boardId,
        },
        orderBy: { id: 'desc' },
        skip,
        take,
        include: {
          communityComments: {
            where: { isDeleted: false },
            include: {
              communitySubcomments: {
                where: { isDeleted: false },
              },
            },
          },
          communityPostLikes: true,
          communityPostBookmarks: true,
        },
      }),
      req.user.id
    ) as unknown) as ApiCommunityPostsListResData['posts']

    res.json({
      totalPage,
      page,
      posts,
    })
  }
)

export default router
