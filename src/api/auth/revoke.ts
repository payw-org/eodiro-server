import { httpStatus } from '@/constant/http-status'
import { extractJwt } from '@/modules/auth/extract-token'
import { signRefreshToken, verifyJwt } from '@/modules/jwt'
import { prisma } from '@/modules/prisma'
import express from 'express'

const router = express.Router()

router.post('/revoke', async (req, res) => {
  const refreshToken = extractJwt(req, res, 'refresh')

  if (!refreshToken) {
    res.status(httpStatus.UNAUTHORIZED).end()
    return
  }

  const [err, authData] = await verifyJwt(refreshToken, 'refresh')

  if (err || authData === undefined) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: err })
  } else {
    // Sign new refresh token
    const newRefreshToken = signRefreshToken(authData)

    await prisma.user.update({
      data: { refreshToken: newRefreshToken },
      where: { id: authData?.userId },
    })

    res.json({ refreshToken: newRefreshToken })
  }
})

export default router
