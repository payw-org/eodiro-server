import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiCommunityLikePostReqBody = {
  postId: number
}

export type ApiCommunityLikePostResData = {
  count: number
  alreadyLiked: boolean
}

router.post<any, ApiCommunityLikePostResData, ApiCommunityLikePostReqBody>(
  '/like-post',
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

    const alreadyLiked = !!(await prisma.communityPostLike.findUnique({
      where: { userId_postId: { userId, postId } },
    }))

    if (alreadyLiked) {
      // await prisma.communityPostLike.delete({
      //   where: { userId_postId: { userId, postId } },
      // })

      const count = await prisma.communityPostLike.count({
        where: { postId },
      })

      res.json({ alreadyLiked, count })
    } else {
      // Create post like record
      const createLike = prisma.communityPostLike.create({
        data: {
          user: {
            connect: { id: userId },
          },
          communityPost: {
            connect: { id: postId },
          },
        },
      })

      // Increment post likes count
      const incrementCount = prisma.communityPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      })

      const [, updatedPost] = await prisma.$transaction([
        createLike,
        incrementCount,
      ])

      res.json({ alreadyLiked, count: updatedPost.likesCount })
    }
  }
)

export default router
