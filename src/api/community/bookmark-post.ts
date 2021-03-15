import { handleExpressValidation } from '@/middleware/handle-express-validation'
import { makeBodyValidator } from '@/modules/express-validator-utils'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiCommunityBookmarkPostReqBody = {
  postId: number
}

export type ApiCommunityBookmarkPostResData = {
  count: number
  isBookmarkedByMe: boolean
}

const body = makeBodyValidator<ApiCommunityBookmarkPostReqBody>()

router.post<
  any,
  ApiCommunityBookmarkPostResData,
  ApiCommunityBookmarkPostReqBody
>(
  '/bookmark-post',
  body('postId').isNumeric(),
  handleExpressValidation,
  async (req, res) => {
    const { postId } = req.body
    const { user } = req
    const userId = user.id

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      res.status(404).end()
      return
    }

    const alreadyBookmarked = await prisma.communityPostBookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    if (alreadyBookmarked) {
      // Delete bookmark record
      const deleteBookmark = prisma.communityPostBookmark.delete({
        where: { userId_postId: { userId, postId } },
      })

      // Decrement bookmarks count
      const decrementCount = prisma.communityPost.update({
        where: { id: postId },
        data: { bookmarksCount: { decrement: 1 } },
      })

      const [, updatedPost] = await prisma.$transaction([
        deleteBookmark,
        decrementCount,
      ])

      res.json({ isBookmarkedByMe: false, count: updatedPost.bookmarksCount })
    } else {
      // Create bookmark record
      const createBookmark = prisma.communityPostBookmark.create({
        data: {
          user: {
            connect: { id: userId },
          },
          communityPost: {
            connect: { id: postId },
          },
        },
      })

      // Increment bookmarks count
      const incrementCount = prisma.communityPost.update({
        where: { id: postId },
        data: { bookmarksCount: { increment: 1 } },
      })

      const [, updatedPost] = await prisma.$transaction([
        createBookmark,
        incrementCount,
      ])

      res.json({ isBookmarkedByMe: true, count: updatedPost.bookmarksCount })
    }
  }
)

export default router
