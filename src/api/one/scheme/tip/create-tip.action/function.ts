import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import Time from '@/modules/time'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, title, body } = data
  const { userId } = authPayload

  const currentTime = Time.getIsoString()
  const user = await prisma.user.findOne({
    where: {
      id: userId,
    },
  })

  const tip = await prisma.tip.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      title,
      body,
      randomNickname: user.randomNickname,
      createdAt: currentTime,
    },
  })

  return {
    err: null,
    data: tip.id,
  }
}

export default func
