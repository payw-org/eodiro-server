import { requireAuth } from '@/middleware/require-auth'
import Auth from '@/modules/auth'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiAuthChangePasswordReqData = {
  userId: number
  password: string
}

router.post('/auth/change-password', requireAuth, async (req, res) => {
  const { userId, password } = req.body as ApiAuthChangePasswordReqData

  await prisma.changePassword.delete({ where: { userId } })

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: await Auth.encryptPw(password),
    },
  })

  res.sendStatus(200)
})

export default router
