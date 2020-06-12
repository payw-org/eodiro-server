import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import { Tip } from '@/database/models/tip'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isLike = false

  const like = await prisma.tipLike.findOne({
    where: {
      userId: userId,
      tipId: tipId,
    },
  })

  if (like === null) {
    isLike = await Tip.like(userId, tipId)
  } else {
    isLike = await Tip.unlike(userId, tipId)
  }

  return {
    err: null,
    data: {
      isLike,
    },
  }
}

export default func
