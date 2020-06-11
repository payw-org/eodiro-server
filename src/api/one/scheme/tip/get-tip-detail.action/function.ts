import { Action } from './interface'
import { OneApiFunction } from '@/api/one/scheme/types/utils'
import prisma from '@/modules/prisma'

const func: OneApiFunction<Action> = async (data) => {
  const { tipId } = data

  const tip = await prisma.tip.findOne({
    where: {
      id: tipId,
    },
  })

  return {
    err: null,
    data: tip,
  }
}

export default func
