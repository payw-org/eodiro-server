import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { handleExpressValidation } from '@/middleware/handle-express-validation'
import {
  makeBodyValidator,
  makeQueryValidator,
} from '@/modules/express-validator-utils'
import prisma from '@/modules/prisma'
import { secureTable } from '@/modules/secure-table'
import { telegramBot } from '@/modules/telegram-bot'
import { dbNow } from '@/modules/time'
import { SafeCommunityComment, SafeCommunitySubcomment } from '@/types/schema'
import express from 'express'

const router = express.Router()

/* ------ Get comments ------ */

export type ApiCommunityGetCommentsReqQuery = {
  postId: number
  /** Comment ID */
  cursor?: number
}
export type ApiCommunityGetCommentsResData = (SafeCommunityComment & {
  communitySubcomments: SafeCommunitySubcomment[]
})[]

const getCommentsQuery = makeQueryValidator<ApiCommunityGetCommentsReqQuery>()

router.get<
  any,
  ApiCommunityGetCommentsResData,
  any,
  ApiCommunityGetCommentsReqQuery
>(
  '/comments',
  getCommentsQuery('postId').isNumeric().toInt(),
  getCommentsQuery('cursor').optional().isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { postId, cursor } = req.query

    const comments = (
      await prisma.communityComment.findMany({
        where: {
          postId,
        },
        include: {
          communitySubcomments: {
            where: {
              isDeleted: false,
            },
          },
        },
        orderBy: { id: 'asc' },
        skip: cursor ? 1 : undefined,
        cursor: cursor ? { id: cursor } : undefined,
      })
    )
      .filter(
        (comment) =>
          !(comment.isDeleted && comment.communitySubcomments.length === 0)
      )
      .map((comment) => {
        const isDeletedButHasSubcomments =
          comment.isDeleted && comment.communitySubcomments.length > 0

        return {
          ...comment,
          randomNickname: isDeletedButHasSubcomments
            ? '알수없음'
            : comment.randomNickname,
          body: isDeletedButHasSubcomments
            ? '삭제된 댓글입니다.'
            : comment.body,
          // Set userId to 0 when the comment is deleted,
          // to make this comment belong to no one
          userId: isDeletedButHasSubcomments ? 0 : comment.userId,
        }
      })

    const safeComments = secureTable(comments, user.id)

    res.json(safeComments)
  }
)

/* ------ Get comments ------ */

/* ------ Create a comment ------ */

export type ApiCommunityCreateCommentReqBody = {
  postId: number
  body: string
}

const createCommentBody = makeBodyValidator<ApiCommunityCreateCommentReqBody>()

router.post<any, any, ApiCommunityCreateCommentReqBody>(
  '/comment',
  createCommentBody('postId').isNumeric(),
  createCommentBody('body').isString().trim().isLength({
    min: eodiroConst.MIN_COMMENT_BODY_LENGTH,
    max: eodiroConst.MAX_COMMENT_BODY_LENGTH,
  }),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { postId, body } = req.body

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    // Create a comment
    const createComment = prisma.communityComment.create({
      data: {
        user: { connect: { id: user?.id } },
        commentedAt: dbNow(),
        randomNickname: user?.randomNickname,
        body,
        communityPost: { connect: { id: postId } },
      },
    })

    // Increment post comments count
    const incrementCount = prisma.communityPost.update({
      where: { id: post.id },
      data: { commentsCount: { increment: 1 } },
    })

    const [comment] = await prisma.$transaction([createComment, incrementCount])

    if (post.userId !== user.id) {
      const telegram = await prisma.telegram.findFirst({
        where: {
          userId: post.userId,
        },
      })

      if (telegram) {
        telegramBot.sendMessage(
          telegram.chatId,
          `
내 글에 댓글이 달렸습니다.
> ${comment.body}

https://eodiro.com/community/board/${post.boardId}/post/${post.id}
        `,
          {
            parse_mode: 'HTML',
          }
        )
      }
    }

    res.sendStatus(httpStatus.OK)
  }
)

/* ------ Create a comment ------ */

/* ------ Delete a comment ------ */

export type ApiCommunityDeleteCommentReqBody = {
  commentId: number
}

router.delete<any, any, ApiCommunityDeleteCommentReqBody>(
  '/comment',
  async (req, res) => {
    const { user } = req
    const { commentId } = req.body

    const comment = await prisma.communityComment.findUnique({
      where: { id: commentId },
    })

    // If comment doesn't exist or deleted
    if (!comment || comment.isDeleted) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    if (comment.userId !== user.id) {
      return res.sendStatus(httpStatus.FORBIDDEN)
    }

    // Delete comment
    const deleteComment = prisma.communityComment.update({
      where: { id: commentId },
      data: {
        isDeleted: true,
      },
    })

    // Decrement post comments count
    const decrementCount = prisma.communityPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { decrement: 1 } },
    })

    await prisma.$transaction([deleteComment, decrementCount])

    res.sendStatus(httpStatus.OK)
  }
)

/* ------ Delete a comment ------ */

/* ------ Get subcomments ------ */

export type ApiCommunityGetSubcommentsReqQuery = {
  commentId: number
  /** Subcomment ID */
  cursor?: number
}

export type ApiCommunitySubcommentsResData = SafeCommunitySubcomment[]

const getSubcommentsQuery =
  makeQueryValidator<ApiCommunityGetSubcommentsReqQuery>()

router.get<
  any,
  ApiCommunitySubcommentsResData,
  any,
  ApiCommunityGetSubcommentsReqQuery
>(
  '/subcomments',
  getSubcommentsQuery('commentId').isNumeric().toInt(),
  getSubcommentsQuery('cursor').optional().isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { commentId, cursor } = req.query

    const post = await prisma.communityComment.findFirst({
      where: { id: commentId, isDeleted: false },
    })

    if (!post) {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }

    const subcomments = await prisma.communitySubcomment.findMany({
      where: { commentId, isDeleted: false },
      orderBy: { id: 'asc' },
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const safeSubcomments = secureTable(subcomments, user.id)

    res.json(safeSubcomments)
  }
)

/* ------ Get subcomments ------ */

/* ------ Create a subcomment ------ */

export type ApiCommunityCreateSubcommentReqBody = {
  body: string
  commentId: number
}

const createSubcommentBody =
  makeBodyValidator<ApiCommunityCreateSubcommentReqBody>()

router.post<any, any, ApiCommunityCreateSubcommentReqBody>(
  '/subcomment',
  createSubcommentBody('body')
    .isString()
    .isLength({
      min: eodiroConst.MIN_COMMENT_BODY_LENGTH,
      max: eodiroConst.MAX_COMMENT_BODY_LENGTH,
    })
    .trim(),
  createSubcommentBody('commentId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req
    const { body, commentId } = req.body

    const comment = await prisma.communityComment.findUnique({
      where: { id: commentId },
      include: {
        communityPost: {
          select: {
            boardId: true,
            userId: true,
          },
        },
      },
    })

    // If the comment doesn't exist or is deleted
    // respond with NOT FOUND (404)
    if (!comment || comment.isDeleted) {
      res.status(404).end()

      return
    }

    // Create a subcomment
    const createSubcomment = prisma.communitySubcomment.create({
      data: {
        user: { connect: { id: user?.id } },
        subcommentedAt: dbNow(),
        randomNickname: user?.randomNickname,
        body,
        communityPost: {
          connect: { id: comment.postId },
        },
        communityComment: { connect: { id: commentId } },
      },
    })

    // Increment post comments count
    const incrementCount = prisma.communityPost.update({
      where: { id: comment.postId },
      data: { commentsCount: { increment: 1 } },
    })

    const [subcomment] = await prisma.$transaction([
      createSubcomment,
      incrementCount,
    ])

    const boardId = comment.communityPost.boardId
    const postId = comment.postId

    // Send a Telegram notification to comment owner
    const commentOwnerId = comment.userId

    if (commentOwnerId !== user.id) {
      const telegram = await prisma.telegram.findFirst({
        where: {
          userId: commentOwnerId,
        },
      })

      if (telegram) {
        telegramBot.sendMessage(
          telegram.chatId,
          `
내 댓글에 대댓글이 달렸습니다.
> ${subcomment.body}

https://eodiro.com/community/board/${boardId}/post/${postId}
        `,
          {
            parse_mode: 'HTML',
          }
        )
      }
    }

    res.sendStatus(httpStatus.OK)
  }
)

/* ------ Create a subcomment ------ */

/* ------ Delete a subcomment ------ */

export type ApiCommunityDeleteSubcommentReqBody = {
  subcommentId: number
}

const deleteSubcommentBody =
  makeBodyValidator<ApiCommunityDeleteSubcommentReqBody>()

router.delete<any, any, ApiCommunityDeleteSubcommentReqBody>(
  '/subcomment',
  deleteSubcommentBody('subcommentId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { user } = req

    const { subcommentId } = req.body
    const subcomment = await prisma.communitySubcomment.findUnique({
      where: { id: subcommentId },
    })

    // If subcomment doesn't exist or deleted
    if (!subcomment || subcomment.isDeleted) {
      res.status(404).end()
      return
    }

    // Unauthorized to delete other's comment
    if (subcomment.userId !== user.id) {
      res.status(403).end()
      return
    }

    // Delete subcomment
    const deleteSubcomment = prisma.communitySubcomment.update({
      where: { id: subcommentId },
      data: {
        isDeleted: true,
      },
    })

    // Decrement post comments count
    const decrementCount = prisma.communityPost.update({
      where: { id: subcomment.postId },
      data: { commentsCount: { decrement: 1 } },
    })

    // Transaction
    await prisma.$transaction([deleteSubcomment, decrementCount])

    res.sendStatus(httpStatus.OK)
  }
)

/* ------ Delete a subcomment ------ */

export default router
