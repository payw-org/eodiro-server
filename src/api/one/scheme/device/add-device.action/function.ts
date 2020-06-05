import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'

import { Action } from './interface'
import Time from '@/modules/time'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async ({
  authPayload,
  deviceId,
  pushToken,
}) => {
  const { userId } = authPayload

  const userDevice = await prisma.device.findOne({
    where: {
      deviceId,
    },
  })

  const currentTime = Time.getIsoString()

  if (userDevice) {
    // Device already registered with the corresponding deviceId
    // Update

    try {
      await prisma.device.update({
        where: {
          deviceId,
        },
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          deviceId,
          pushToken,
          activatedAt: currentTime,
        },
      })
    } catch (err) {
      return {
        err: OneApiError.BAD_REQUEST,
        errMeta: err.meta,
      }
    }
  } else {
    try {
      await prisma.device.create({
        data: {
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
    } catch (err) {
      return {
        err: OneApiError.BAD_REQUEST,
        errMeta: err.meta,
      }
    }
  }

  return {
    err: null,
  }
}

export default func
