import { OneApiError, OneApiFunc } from '@/api/one/types'

import { Action } from './interface'
import { Tip } from '@/database/models/tip'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload

  if ((await prisma.tip.findOne({ where: { id: tipId } })) === null) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  if (!Tip.isOwnedBy(userId, tipId)) {
    return oneApiResponse<Action>(OneApiError.FORBIDDEN)
  }

  await prisma.tip.delete({ where: { id: tipId } })

  return oneApiResponse<Action>({ isRemoved: true })
}

export default func
