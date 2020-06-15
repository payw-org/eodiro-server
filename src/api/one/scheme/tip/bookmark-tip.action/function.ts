import { Action } from './interface'
import { OneApiFunction } from '@/api/one/types'
import { Tip } from '@/database/models/tip'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isBookmarked = false

  if (await Tip.isBookmarked(userId, tipId)) {
    isBookmarked = await Tip.cancelBookmark(userId, tipId)
  } else {
    isBookmarked = await Tip.bookmark(userId, tipId)
  }

  return {
    err: null,
    data: {
      isBookmarked,
    },
  }
}

export default func
