import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { TipListResponse } from '@/database/models/tip'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { topic, cursor } = data

  const totalCount = await prisma.tip.count()

  const tipList = await prisma.tip.findMany({
    where: {
      topic: topic,
      isRemoved: false,
    },
    include: {
      tipLikes: true,
      tipBookmarks: true,
    },
    cursor: {
      id: cursor,
    },
    take: -10,
  })

  const tips = tipList.map((item) => {
    const response: TipListResponse = {
      ...item,
      tipLikes: item.tipLikes.length,
      tipBookmarks: item.tipBookmarks.length,
      isLiked: true,
      isBookmarked: true,
    }
    return response
  })

  return oneApiResponse<Action>({ tips, totalCount })
}

export default func
