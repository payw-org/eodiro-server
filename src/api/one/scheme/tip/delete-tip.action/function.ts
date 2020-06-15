import { OneApiError, OneApiFunction } from '@/api/one/types'

import { Action } from './interface'
import { Tip } from '@/database/models/tip'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload

  if ((await prisma.tip.findOne({ where: { id: tipId } })) === null) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  if (!Tip.isOwnedBy(userId, tipId)) {
    return { err: OneApiError.FORBIDDEN, data: null }
  }

  await prisma.tip.delete({ where: { id: tipId } })

  return {
    err: null,
    data: true,
  }
}

export default func
