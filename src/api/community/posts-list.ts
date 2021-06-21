import { eodiroConst } from '@/constant'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeQueryValidator } from '@/modules/express-validator-utils'
import prisma from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import { Prisma } from '@/prisma/client'
import { SafeCommunityPost } from '@/types/schema'
import express from 'express'

const router = express.Router()

export type ApiCommunityPostsListReqQuery = {
  boardId?: number
  page?: number
  my?: 'posts' | 'comments' | 'bookmarks'
  contains?: string
}

export type ApiCommunityPostsListResData = {
  totalPage: number
  page: number
  posts: SafeCommunityPost[]
}

const query = makeQueryValidator<ApiCommunityPostsListReqQuery>()

router.get<
  any,
  ApiCommunityPostsListResData,
  any,
  ApiCommunityPostsListReqQuery
>(
  '/posts-list',
  query('boardId').optional().isNumeric().toInt(),
  query('page').optional().isNumeric().toInt(),
  query('my').optional().isString(),
  query('contains').optional().isString(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const userId = user.id
    const { boardId, page = 1, my, contains } = req.query

    const take = eodiroConst.POSTS_TAKE_IN_ONE_PAGE
    const skip = Math.max(page - 1, 0) * take
    let totalPage = 0

    let posts: SafeCommunityPost[] = []

    const whereClause: Prisma.CommunityPostWhereInput | undefined = {
      isDeleted: false,
      boardId,
      OR: contains
        ? [{ title: { contains } }, { body: { contains } }]
        : undefined,
    }

    if (boardId) {
      totalPage = Math.ceil(
        (await prisma.communityPost.count({
          where: whereClause,
        })) / take
      )

      posts = secureTable(
        await prisma.communityPost.findMany({
          where: whereClause,
          orderBy: { id: 'desc' },
          skip,
          take,
        }),
        userId
      )
    } else if (my === 'posts') {
      totalPage = Math.ceil(
        (await prisma.communityPost.count({
          where: { userId: user.id, isDeleted: false },
        })) / take
      )

      posts = secureTable(
        await prisma.communityPost.findMany({
          where: {
            userId,
            isDeleted: false,
          },
          orderBy: { id: 'desc' },
          skip,
          take,
        }),
        userId
      )
    } else if (my === 'comments') {
      totalPage = Math.ceil(
        (
          await prisma.communityComment.findMany({
            where: { userId: user.id, isDeleted: false },
            distinct: ['postId'],
          })
        ).length / take
      )

      posts = secureTable(
        await prisma.communityPost.findMany({
          where: {
            AND: {
              isDeleted: false,
            },
            OR: [
              {
                communityComments: {
                  some: {
                    userId,
                    isDeleted: false,
                  },
                },
              },
              {
                communitySubcomments: {
                  some: {
                    userId,
                    isDeleted: false,
                  },
                },
              },
            ],
          },
          orderBy: { id: 'desc' },
          skip,
          take,
        }),
        userId
      )
    } else if (my === 'bookmarks') {
      totalPage = Math.ceil(
        (await prisma.communityPostBookmark.count({
          where: { userId: user.id },
        })) / take
      )

      posts = secureTable(
        await prisma.communityPost.findMany({
          where: {
            isDeleted: false,
            communityPostBookmarks: {
              some: {
                userId,
              },
            },
          },
          orderBy: { id: 'desc' },
          skip,
          take,
        }),
        userId
      )
    }

    res.json({
      totalPage,
      page,
      posts,
    })
  }
)

export default router
