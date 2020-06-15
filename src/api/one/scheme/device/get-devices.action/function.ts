import { Action } from './interface'
import { OneApiFunction } from '@/api/one/types'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async ({ authPayload }) => {
  const { userId } = authPayload

  const devices = await prisma.device.findMany({
    where: {
      userId,
    },
  })

  return {
    err: null,
    data: devices,
  }
}

export default func
