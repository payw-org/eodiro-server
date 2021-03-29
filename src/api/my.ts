import { httpStatus } from '@/constant/http-status'
import { requireAuth } from '@/middleware/require-auth'
import { prisma } from '@/modules/prisma'
import { User } from '@/prisma/client'
import express from 'express'

const router = express.Router()

router.use(requireAuth)

export type SafeUser = Omit<User, 'id' | 'password' | 'refreshToken'>

router.get<any, SafeUser>('/information', async (req, res) => {
  const { user } = req

  const safeUser: SafeUser | null = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      portalId: true,
      nickname: true,
      randomNickname: true,
      joinedAt: true,
      point: true,
    },
  })

  if (safeUser === null) {
    return res.sendStatus(httpStatus.NOT_FOUND)
  }

  res.json(safeUser)
})

export default router
