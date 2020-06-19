import { TipAttrs, TipListResponse } from '@/database/models/tip'

import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'
import { prismaTimeMod } from '@/modules/time'

const func: OneApiFunc<Action> = async (data) => {
  const { topic, page } = data
  const pageSize = 10
  let tipList: TipAttrs[]

  const totalCount = await prisma.tip.count()
  if (topic === null) {
    tipList = await TipRepository.findAll(pageSize, page)
  } else {
    tipList = await TipRepository.findByTopic(topic, pageSize, page)
  }

  const tips = prismaTimeMod(
    tipList.map((item) => {
      const response: TipListResponse = {
        ...item,
        tipLikes: item.tipLikes.length,
        tipBookmarks: item.tipBookmarks.length,
        isLiked: true,
        isBookmarked: true,
      }
      return response
    })
  )

  const totalPage =
    totalCount % 10 === 0 ? totalCount / 10 : Math.floor(totalCount / 10) + 1

  return oneApiResponse<Action>({ tips, totalCount, totalPage, page })
}

export default func
