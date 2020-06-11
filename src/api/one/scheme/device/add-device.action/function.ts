import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import Time from '@/modules/time'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async ({
  authPayload,
  deviceId,
  pushToken,
}) => {
  const { userId } = authPayload

  const currentTime = Time.getIsoString()

  await prisma.device.upsert({
    where: {
      deviceId,
    },
    update: {
      user: {
        connect: {
          id: userId,
        },
      },
      deviceId,
      pushToken,
      activatedAt: currentTime,
    },
    create: {
      user: {
        connect: {
          id: userId,
        },
      },
      deviceId,
      pushToken,
      registeredAt: currentTime,
      activatedAt: currentTime,
    },
  })

  return {
    err: null,
  }
}

export default func
