import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'
import { Tip, TipUpdateBody } from '@/database/models/tip'

import { Action } from './interface'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId, title, body } = data
  const { userId } = authPayload
  const updateBody: TipUpdateBody = { title, body }

  try {
    const tip = await prisma.tip.findOne({ where: { id: tipId } })
    if (tip === null) {
      return {
        err: OneApiError.NO_CONTENT,
        data: null,
      }
    }

    if (tip.userId !== userId) {
      return {
        err: OneApiError.FORBIDDEN,
        data: null,
      }
    }

    Tip.renew(tipId, updateBody)

    return {
      err: null,
      data: true,
    }
  } catch (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }
}

export default func
