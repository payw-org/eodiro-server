import {
  Tip,
  TipAttrs,
  TipListResponse,
  TipResponse,
} from '@/database/models/tip'

import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { topic, page } = data
  const pageSize = 10
  let tipList: TipAttrs[]

  const totalCount = await prisma.tip.count()
  if (topic === null) {
    tipList = await prisma.tip.findMany({
      where: {
        isRemoved: false,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
      take: -pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    })
  } else {
    tipList = await prisma.tip.findMany({
      where: {
        topic: topic,
        isRemoved: false,
      },
      include: {
        tipLikes: true,
        tipBookmarks: true,
      },
      take: -pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
    })
  }

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

  const totalPage =
    totalCount % 10 === 0 ? totalCount / 10 : Math.floor(totalCount / 10) + 1

  return oneApiResponse<Action>({ tips, totalCount, totalPage, page })
}

export default func
