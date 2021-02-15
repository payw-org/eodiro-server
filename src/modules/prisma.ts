import { PrismaClient } from '@prisma/client'
import { prismaTimeMod } from './time'

function timeMod(prismaInstance: PrismaClient) {
  prismaInstance.$use(async (params, next) => {
    const result = await next(params)

    // Subtract 9 hours from UTC
    return prismaTimeMod(result)
  })
}

const prisma = new PrismaClient()
timeMod(prisma)

export { prisma }
