import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'

import { Action } from './interface'
import Time from '@/modules/time'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, noticeKey } = data
  const { userId } = authPayload

  if (!noticeKey) {
    return {
      err: 'NoticeKey Required',
    }
  }

  try {
    const subscriptions = await prisma.noticeNotificationsSubscription.findMany(
      {
        where: {
          userId,
          noticeKey,
        },
      }
    )

    if (subscriptions.length !== 0) {
      // Already subscribed with the notice key
      await prisma.noticeNotificationsSubscription.delete({
        where: {
          userId,
          noticeKey,
        },
      })

      return {
        err: null,
        data: {
          [noticeKey]: false,
        },
      }
    } else {
      await prisma.noticeNotificationsSubscription.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          noticeKey,
          subscribedAt: Time.getIsoString(),
        },
      })

      return {
        err: null,
        data: {
          [noticeKey]: true,
        },
      }
    }
  } catch (err) {
    console.log(err)
    return {
      err: OneApiError.INTERNAL_SERVER_ERROR,
    }
  }
}

export default func
