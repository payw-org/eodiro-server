import { OneApiError, OneApiFunc } from '@/api/one/types'

import { Action } from './interface'
import { TipCommentsResponse } from '@/database/models/tip_comment'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { tipId, lastCommentId } = data

  try {
    const totalCount = await prisma.tipComment.count()

    const tipCommentList = await prisma.tipComment.findMany({
      where: {
        tipId: tipId,
        id: {
          gt: lastCommentId,
        },
      },
    })

    const tipComments = tipCommentList.map((item) => {
      const response: TipCommentsResponse = {
        ...item,
      }
      return response
    })

    return oneApiResponse<Action>({
      tipComments,
      totalCount,
    })
  } catch (err) {
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
