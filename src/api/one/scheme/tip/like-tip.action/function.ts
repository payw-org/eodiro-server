import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { Tip } from '@/database/models/tip'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'

const func: OneApiFunc<Action> = async ({ authPayload, tipId }) => {
  const { userId } = authPayload

  let isLiked = false
  let likes = 0

  if (await Tip.isLiked(userId, tipId)) {
    isLiked = await Tip.unlike(userId, tipId)

    const tip = await TipRepository.findById(tipId)
    likes = tip.tipLikes.length
  } else {
    isLiked = await Tip.like(userId, tipId)

    const tip = await TipRepository.findById(tipId)
    likes = tip.tipLikes.length

    if (likes >= 50) {
      Tip.archive(tipId)
    }
  }

  return oneApiResponse<Action>({ isLiked, likes })
}

export default func
