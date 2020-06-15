import { OneApiError, OneApiFunction } from '@/api/one/types'

import { Action } from './interface'
import { TipCommentsResponse } from '@/database/models/tip_comment'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
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

    return {
      err: null,
      data: {
        tipComments,
        totalCount,
      },
    }
  } catch (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }
}

export default func
