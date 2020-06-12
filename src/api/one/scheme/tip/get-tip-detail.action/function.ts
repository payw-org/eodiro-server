import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'

import { Action } from './interface'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { tipId } = data

  try {
    const tip = await prisma.tip.findOne({
      where: {
        id: tipId,
      },
      include: {
        tipLikes: true,
      },
    })
    if (tip === null) {
      return {
        err: OneApiError.NO_CONTENT,
        data: null,
      }
    }

    const tipWithTipLikesCount = {
      ...tip,
      tipLikes: tip.tipLikes.length,
    }

    return {
      err: null,
      data: tipWithTipLikesCount,
    }
  } catch (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }
}

export default func
