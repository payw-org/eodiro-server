import { eodiroConst } from '@/constant'
import { LogInInfo } from '@/modules/auth'
import { setCookie } from '@/modules/cookie'
import EodiroEncrypt from '@/modules/eodiro-encrypt'
import { AuthData, signAccessToken, signRefreshToken } from '@/modules/jwt'
import { prisma } from '@/modules/prisma'
import { sanitizePortalId } from '@/modules/sanitize-portal-id'
import express from 'express'
import { refreshRouterPath } from './refresh'
import { revokeRouterPath } from './revoke'

export type ApiAuthLoginReqBody = LogInInfo
export type ApiAuthLoginResData = {
  isSigned: boolean
  refreshToken?: string
  accessToken?: string
}

const router = express.Router()

// Sign in
router.post('/log-in', async (req, res) => {
  const { portalId, password } = req.body as LogInInfo
  const resData: ApiAuthLoginResData = { isSigned: false }

  if (!portalId || !password) {
    res.json(resData)
    return
  }

  const sanitizedPortalId = sanitizePortalId(portalId)
  const user = await prisma.user.findUnique({
    where: { portalId: sanitizedPortalId },
  })

  if (!user) {
    res.json(resData)
    return
  }

  const isPasswordMatched = await EodiroEncrypt.isSame(password, user.password)

  if (isPasswordMatched) {
    const authData: AuthData = { userId: user.id }
    let refreshToken = ''

    if (user.refreshToken) {
      refreshToken = user.refreshToken
    } else {
      refreshToken = signRefreshToken(authData)

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      })
    }

    const accessToken = signAccessToken(authData)

    resData.refreshToken = refreshToken
    resData.accessToken = accessToken

    const expires = new Date('2038-01-01').toUTCString()
    const refreshTokenPaths = [refreshRouterPath, revokeRouterPath]

    setCookie(req, res, [
      {
        name: eodiroConst.EDR_ACCESS_TOKEN_NAME,
        value: accessToken,
        expires,
        path: '/',
      },
      ...refreshTokenPaths.map((path) => ({
        name: eodiroConst.EDR_REFRESH_TOKEN_NAME,
        value: refreshToken,
        expires,
        path,
      })),
    ])
  }

  resData.isSigned = isPasswordMatched

  res.json(resData)
})

export default router
