import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import { Tip } from '@/database/models/tip'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let isBookmarked = false

  const bookmark = await prisma.tipBookmark.findMany({
    where: {
      AND: [{ userId: userId }, { tipId: tipId }],
    },
  })

  if (bookmark.length === 0) {
    isBookmarked = await Tip.bookmark(userId, tipId)
  } else {
    isBookmarked = await Tip.cancelBookmark(userId, tipId)
  }

  return {
    err: null,
    data: {
      isBookmarked,
    },
  }
}

export default func
