import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload } = data
  const { userId } = authPayload

  const subscriptions = await prisma.noticeNotificationsSubscription.findMany({
    where: {
      userId,
    },
  })

  return {
    err: null,
    data: {
      subscriptions: subscriptions.map((sub) => sub.noticeKey),
    },
  }
}

export default func
