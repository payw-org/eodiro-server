import { OneApiError, OneApiFunction } from '@/api/one/types'
import { Tip, TipResponse } from '@/database/models/tip'

import { Action } from './interface'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload

  try {
    const tip = await prisma.tip.findOne({
      where: {
        id: tipId,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
    })
    if (tip === null) {
      return {
        err: OneApiError.NO_CONTENT,
        data: null,
      }
    }

    const tipResponse: TipResponse = {
      ...tip,
      tipLikes: tip.tipLikes.length,
      tipBookmarks: tip.tipBookmarks.length,
      isLiked: await Tip.isLiked(userId, tipId),
      isBookmarked: await Tip.isBookmarked(userId, tipId),
    }

    return {
      err: null,
      data: tipResponse,
    }
  } catch (err) {
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
      data: null,
    }
  }
}

export default func
