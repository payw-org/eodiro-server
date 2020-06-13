import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import Time from '@/modules/time'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
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

    return {
      err: null,
      data: { tipCommentId: tipComment.id },
    }
  } catch (err) {
    return {
      err: null,
      data: null,
    }
  }
}

export default func
