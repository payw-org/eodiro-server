import { eodiroConst } from '@/constant'
import { httpStatus } from '@/constant/http-status'
import { Cookies, setCookie } from '@/modules/cookie'
import express from 'express'
import { refreshRouterPath } from './refresh'
import { revokeRouterPath } from './revoke'

const router = express.Router()

router.post('/log-out', async (req, res) => {
  const refreshTokenPaths = [refreshRouterPath, revokeRouterPath]

  const cookies: Cookies = [
    {
      name: eodiroConst.EDR_ACCESS_TOKEN_NAME,
      expires: new Date('1997-01-01').toUTCString(),
      value: '',
      path: '/',
    },
    ...refreshTokenPaths.map((path) => ({
      name: eodiroConst.EDR_REFRESH_TOKEN_NAME,
      expires: new Date('1997-01-01').toUTCString(),
      value: '',
      path,
    })),
  ]

  setCookie(req, res, cookies)

  res.status(httpStatus.OK).end()
})

export default router
