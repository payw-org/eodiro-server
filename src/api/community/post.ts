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

export type ApiCommunityGetPostResData = SafeCommunityPost

const query = makeQueryValidator<ApiCommunityGetPostReqQuery>()

router.get<any, any, any, ApiCommunityGetPostReqQuery>(
  '/community/post',
  query('postId').isNumeric().toInt(),
  handleExpressValidation,
  async (req, res) => {
    const { postId } = req.query

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

    res.json(safePost)
  }
)

export default router
