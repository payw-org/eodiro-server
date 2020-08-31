import { OneApiError, OneApiFunc } from '@/api/one/types'

import { Action } from './interface'
import { TipComment } from '@/database/models/tip_comment'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipCommentId } = data
  const { userId } = authPayload

  try {
    if (
      (await prisma.tipComment.findOne({ where: { id: tipCommentId } })) ===
      null
    ) {
      return oneApiResponse<Action>(OneApiError.NO_CONTENT)
    }

    if (!TipComment.isOwnedBy(userId, tipCommentId)) {
      return oneApiResponse<Action>(OneApiError.FORBIDDEN)
    }

    await prisma.tipComment.update({
      where: { id: tipCommentId },
      data: { isRemoved: true },
    })

    return oneApiResponse<Action>({ isRemoved: true })
  } catch (err) {
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
