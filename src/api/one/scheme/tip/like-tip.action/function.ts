import { Action } from './interface'
import { OneApiFunction } from '@/api/one/types'
import { Tip } from '@/database/models/tip'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isLike = false

  if (await Tip.isLiked(userId, tipId)) {
    isLike = await Tip.unlike(userId, tipId)
  } else {
    isLike = await Tip.like(userId, tipId)
  }

  return {
    err: null,
    data: {
      isLike,
    },
  }
}

export default func
