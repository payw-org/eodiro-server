import { eodiroConsts } from '@/constants'
import { extractJwt } from '@/modules/auth/extract-token'
import { Cookies, setCookie } from '@/modules/cookie'
import { signAccessToken, verifyJwt } from '@/modules/jwt'
import express from 'express'

const router = express.Router()

// Refresh access token
router.post('/auth/refresh', async (req, res) => {
  const refreshToken = extractJwt(req, res, 'refresh')

  if (!refreshToken) {
    res.status(401).end()

    return
  }

  const [err, authData] = await verifyJwt(refreshToken, 'refresh')

  if (err) {
    res.status(401).json({ error: err })
  } else {
    // Sign new access token
    const newAccessToken = signAccessToken(authData)

    // Set cookie
    setCookie(req, res, {
      name: eodiroConsts.EDR_ACCESS_TOKEN_NAME,
      value: newAccessToken,
      expires: new Date('2038-01-01').toUTCString(),
    })

    res.json({ accessToken: newAccessToken })
  }
})

// Delete refresh token
router.delete('/auth/refresh', async (req, res) => {
  const refreshTokenPaths = ['/api/auth/refresh', '/api/auth/revoke']

  const cookies: Cookies = [
    {
      name: eodiroConsts.EDR_ACCESS_TOKEN_NAME,
      expires: new Date('1997-01-01').toUTCString(),
      value: '',
      path: '/',
    },
    {
      name: eodiroConsts.EDR_REFRESH_TOKEN_NAME,
      expires: new Date('1997-01-01').toUTCString(),
      value: '',
    },
    ...refreshTokenPaths.map((path) => ({
      name: eodiroConsts.EDR_REFRESH_TOKEN_NAME,
      expires: new Date('1997-01-01').toUTCString(),
      value: '',
      path,
    })),
  ]

  setCookie(req, res, cookies)
})

export default router
