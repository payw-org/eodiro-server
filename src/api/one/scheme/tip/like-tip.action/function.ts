import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { Tip } from '@/database/models/tip'
import { oneApiResponse } from '@/api/one/utils'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isLike = false

  if (await Tip.isLiked(userId, tipId)) {
    isLike = await Tip.unlike(userId, tipId)
  } else {
    isLike = await Tip.like(userId, tipId)
  }

  return oneApiResponse<Action>({ isLike })
}

export default func
