import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'

import { Action } from './interface'
import { TipComment } from '@/database/models/tip_comment'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipCommentId } = data
  const { userId } = authPayload

  if (
    (await prisma.tipComment.findOne({ where: { id: tipCommentId } })) === null
  ) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  if (!TipComment.isOwnedBy(userId, tipCommentId)) {
    return { err: OneApiError.FORBIDDEN, data: null }
  }

  await prisma.tipComment.delete({ where: { id: tipCommentId } })

  return {
    err: null,
    data: true,
  }
}

export default func
