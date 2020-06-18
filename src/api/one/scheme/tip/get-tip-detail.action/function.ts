import { OneApiError, OneApiFunc } from '@/api/one/types'
import { Tip, TipResponse } from '@/database/models/tip'

import { Action } from './interface'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload

  try {
    const tip = await TipRepository.findById(tipId)
    if (tip === null || tip.isRemoved) {
      return oneApiResponse<Action>(OneApiError.NO_CONTENT)
    }

    const tipResponse: TipResponse = {
      ...tip,
      tipLikes: tip.tipLikes.length,
      tipBookmarks: tip.tipBookmarks.length,
      isLiked: await Tip.isLiked(userId, tipId),
      isBookmarked: await Tip.isBookmarked(userId, tipId),
    }

    return oneApiResponse<Action>(tipResponse)
  } catch (err) {
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
