import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { Tip } from '@/database/models/tip'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isBookmarked = false

  if (await Tip.isBookmarked(userId, tipId)) {
    isBookmarked = await Tip.cancelBookmark(userId, tipId)
  } else {
    isBookmarked = await Tip.bookmark(userId, tipId)
  }

  const tip = await TipRepository.findById(tipId)
  const bookmarks = tip.tipBookmarks.length

  return oneApiResponse<Action>({ isBookmarked, bookmarks })
}

export default func
