import { Action } from './interface'
import { OneApiFunc } from '@/api/one/types'
import Time from '@/modules/time'
import { oneApiResponse } from '@/api/one/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunc<Action> = async (data) => {
  const { authPayload, title, topic, body } = data
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
      topic,
      body,
      randomNickname: user.randomNickname,
      createdAt: currentTime,
      editedAt: currentTime,
    },
  })

  return oneApiResponse<Action>({ tipId: tip.id })
}

export default func
