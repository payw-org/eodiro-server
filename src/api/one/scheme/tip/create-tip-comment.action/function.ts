import { OneApiError, OneApiFunc } from '@/api/one/types'

import { Action } from './interface'
import Time from '@/modules/time'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, tipId, body } = data
  const { userId } = authPayload

  try {
    const currentTime = Time.getIsoString()
    const user = await prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    const tipComment = await prisma.tipComment.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        tip: {
          connect: {
            id: tipId,
          },
        },
        body,
        randomNickname: user.randomNickname,
        createdAt: currentTime,
        editedAt: currentTime,
      },
    })

    return oneApiResponse<Action>({ tipCommentId: tipComment.id })
  } catch (err) {
    return oneApiResponse<Action>(OneApiError.INTERNAL_SERVER_ERROR)
  }
}

export default func
