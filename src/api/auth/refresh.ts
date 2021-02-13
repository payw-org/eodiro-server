import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { extractJwt } from '@/modules/auth/extract-token'
import { setCookie } from '@/modules/cookie'
import { signAccessToken, verifyJwt } from '@/modules/jwt'
import express from 'express'

const router = express.Router()

export const refreshRouterPath = '/auth/refresh'

export type ApiAuthRefreshResData = {
  accessToken: string
}

// Refresh access token
router.post(refreshRouterPath, async (req, res) => {
  const refreshToken = extractJwt(req, res, 'refresh')

  if (!refreshToken) {
    return res.sendStatus(httpStatus.UNAUTHORIZED)
  }

  const [err, authData] = await verifyJwt(refreshToken, 'refresh')

  if (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: err })
  }

  // Sign new access token
  const newAccessToken = signAccessToken(authData)

  // Set cookie
  setCookie(req, res, {
    name: eodiroConst.EDR_ACCESS_TOKEN_NAME,
    value: newAccessToken,
    expires: new Date('2038-01-01').toUTCString(),
  })

  res.json({ accessToken: newAccessToken })
})

export default router
