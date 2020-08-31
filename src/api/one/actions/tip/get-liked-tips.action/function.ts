import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import { TipListResponse } from '@/database/models/tip'
import { TipRepository } from '@/database/repository/tip-repository'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'
import { prismaTimeMod } from '@/modules/time'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, page } = data
  const { userId } = authPayload
  const pageSize = 10

  let totalCount = 0

  totalCount = await prisma.tip.count({
    where: {
      isRemoved: false,
      tipLikes: {
        some: {
          userId,
        },
      },
    },
  })
  const tipList = await TipRepository.findLiked(userId, pageSize, page)

  const tips = tipList.map((item) => {
    const response: TipListResponse = {
      ...item,
      tipLikes: item.tipLikes.length,
      isLiked: true,
    }
    return response
  })

  const totalPage =
    totalCount % pageSize === 0
      ? totalCount / pageSize
      : Math.floor(totalCount / pageSize) + 1

  return oneApiResponse<Action>({
    tips: prismaTimeMod(tips),
    totalCount,
    totalPage,
    page,
  })
}

export default func
