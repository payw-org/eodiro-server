import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeQueryValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import { SafeCommunityPost } from '@/types/schema'
import express from 'express'

const router = express.Router()

export type ApiCommunityGetPostReqQuery = {
  postId: number
}

export type ApiCommunityGetPostResData = SafeCommunityPost & {
  likedByMe: boolean
  bookmarkedByMe: boolean
  hasBeenEdited: boolean
}

const query = makeQueryValidator<ApiCommunityGetPostReqQuery>()

router.get<any, ApiCommunityGetPostResData, any, ApiCommunityGetPostReqQuery>(
  '/community/post',
  query('postId').isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { postId } = req.query
    const userId = req.user.id

    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post || post.isDeleted) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const safePost = (secureTable(
      post,
      req.user.id
    ) as unknown) as SafeCommunityPost

    const likedByMe = !!(await prisma.communityPostLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    }))

    const bookmarkedByMe = !!(await prisma.communityPostBookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    }))

    res.json({
      ...safePost,
      likedByMe,
      bookmarkedByMe,
      hasBeenEdited: !!post.editedAt,
    })
  }
)

export default router
