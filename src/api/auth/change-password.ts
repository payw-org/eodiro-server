import { requireAuth } from '@/middleware/require-auth'
import Auth from '@/modules/auth'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

export type ApiAuthChangePasswordReqData = {
  newPassword: string
}

router.post<any, any, ApiAuthChangePasswordReqData>(
  '/auth/change-password',
  requireAuth,
  async (req, res) => {
    const { newPassword } = req.body
    const userId = req.user.id

    await prisma.changePassword.delete({ where: { userId } })
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: await Auth.encryptPw(newPassword),
      },
    })

    res.sendStatus(200)
  }
)

export default router
