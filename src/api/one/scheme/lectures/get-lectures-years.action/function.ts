import type { Action } from './interface'
import type { OneApiFuncWithoutRequestData } from '@/api/one/types'
import prisma from '@/modules/prisma'
import { oneApiResponse } from '@/api/one/utils'

const func: OneApiFuncWithoutRequestData<Action> = async () => {
  const years = Array.from(
    new Set(
      (
        await prisma.lecture.findMany({
          select: {
            year: true,
          },
        })
      ).map((item) => item.year)
    )
  )

  return oneApiResponse<Action>({ years })
}

export default func
