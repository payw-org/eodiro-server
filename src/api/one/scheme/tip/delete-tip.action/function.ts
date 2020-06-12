import { OneApiError, OneApiFunction } from '@/api/one/scheme/types/utils'

import { Action } from './interface'
import { Tip } from '@prisma/client'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { authPayload, tipId } = data
  const { userId } = authPayload
  let tip: Tip

  try {
    tip = await prisma.tip.findOne({ where: { id: tipId } })
  } catch (err) {
    return {
      err: OneApiError.NO_CONTENT,
      data: null,
    }
  }

  if (tip.userId !== userId) {
    return {
      err: OneApiError.FORBIDDEN,
      data: null,
    }
  }

  await prisma.tip.delete({ where: { id: tipId } })

  return {
    err: null,
    data: true,
  }
}

export default func
