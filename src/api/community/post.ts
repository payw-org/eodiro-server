import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import {
  makeBodyValidator,
  makeQueryValidator,
} from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import { dbNow } from '@/modules/time'
import { SafeCommunityPost } from '@/types/schema'
import express from 'express'

const router = express.Router()
const postRouterPath = '/community/post'

/* ------ Get a post ------ */

export type ApiCommunityGetPostReqQuery = {
  postId: number
}

export type ApiCommunityGetPostResData = SafeCommunityPost & {
  likedByMe: boolean
  bookmarkedByMe: boolean
  hasBeenEdited: boolean
  communityBoard: {
    name: string
  }
}

const query = makeQueryValidator<ApiCommunityGetPostReqQuery>()

router.get<any, ApiCommunityGetPostResData, any, ApiCommunityGetPostReqQuery>(
  postRouterPath,
  query('postId').isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { postId } = req.query
    const userId = req.user.id

    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        communityBoard: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post || post.isDeleted) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const safePost = secureTable(post, req.user.id)

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

/* ------ Get a post ------ */

/* ------ Upsert a post ------ */

export type ApiCommunityUpsertPostReqBody = {
  postId?: number
  boardId: number
  title: string
  body: string
}

export type ApiCommunityUpsertPostResData = {
  postId: number
}

const upsertPostBody = makeBodyValidator<ApiCommunityUpsertPostReqBody>()

router.post(
  postRouterPath,
  upsertPostBody('postId').optional().isNumeric(),
  upsertPostBody('boardId').isNumeric(),
  upsertPostBody('title').isString().trim().isLength({
    min: eodiroConst.MIN_POST_TITLE_LENGTH,
    max: eodiroConst.MAX_POST_TITLE_LENGTH,
  }),
  upsertPostBody('body').isString().trim().isLength({
    min: eodiroConst.MIN_POST_BODY_LENGTH,
    max: eodiroConst.MAX_COMMENT_BODY_LENGTH,
  }),
  handleExpressValidation,
  async (req, res) => {
    const { postId, boardId, title, body } = req.body
    const { user } = req

    // Upsert post
    const upsertResult = await prisma.communityPost.upsert({
      where: { id: postId ?? 0 },
      create: {
        title,
        body,
        randomNickname: user.randomNickname,
        postedAt: dbNow(),
        user: {
          connect: { id: user.id },
        },
        communityBoard: {
          connect: { id: boardId },
        },
      },
      update: {
        title,
        body,
        editedAt: dbNow(),
      },
    })

    // Update board active at
    await prisma.communityBoard.update({
      where: { id: upsertResult.boardId },
      data: { activeAt: dbNow() },
    })

    res.json({
      postId: upsertResult.id,
    })
  }
)

/* ------ Upsert a post ------ */

/* ------ Delete a post ------ */

export type ApiCommunityDeletePostReqBody = {
  postId: number
}

const deletePostBody = makeBodyValidator<ApiCommunityDeletePostReqBody>()

router.delete(
  postRouterPath,
  deletePostBody('postId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { postId } = req.body
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })
    const { user } = req

    // No post
    if (!post) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    // Forbidden
    if (post.userId !== user.id) {
      return res.sendStatus(httpStatus.FORBIDDEN)
    }

    // Delete
    await prisma.communityPost.update({
      where: { id: postId },
      data: {
        isDeleted: true,
      },
    })

    res.sendStatus(httpStatus.OK)
  }
)

/* ------ Delete a post ------ */

export default router
