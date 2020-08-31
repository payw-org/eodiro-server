import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { TipListResponse } from '@/database/models/tip'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'
import { prismaTimeMod } from '@/modules/time'

const func: OneApiFunc<Action> = async (data) => {
  const { page } = data
  const pageSize = 10

  const totalCount = await prisma.tip.count({
    where: { isArchived: true, isRemoved: false },
  })

  const tipList = await TipRepository.findArchived(pageSize, page)

  const tips = tipList.map((item) => {
    const response: TipListResponse = {
      ...item,
      tipLikes: item.tipLikes.length,
      isLiked: true,
    }
    return response
  })

  const totalPage =
    totalCount % 10 === 0 ? totalCount / 10 : Math.floor(totalCount / 10) + 1

  return oneApiResponse<Action>({
    tips: prismaTimeMod(tips),
    totalCount,
    totalPage,
    page,
  })
}

export default func
